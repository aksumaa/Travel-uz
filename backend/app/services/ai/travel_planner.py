import logging
from typing import Dict, Any, Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.schemas.ai import (
    TripClarifyRequest, TripClarifyResponse, ClarificationQuestion, ClarificationOption,
    TripStrategiesRequest, TripStrategiesResponse, TripStrategyOption,
    TripPlanRequest, StructuredItinerary, StructuredDay, ActivityItem, DayBudgetBreakdown,
    TripAdaptationRequest, TripAdaptationResponse, ScheduleMutation,
    LocationAwareQueryRequest, LocationAwareQueryResponse
)
from app.services.ai.factory import get_ai_provider
from app.services.ai.prompts import (
    SYSTEM_CLARIFICATION_PROMPT, SYSTEM_STRATEGIES_PROMPT,
    SYSTEM_ITINERARY_PROMPT, SYSTEM_ADAPTATION_PROMPT, SYSTEM_LOCATION_AGENT_PROMPT
)
from app.services.ai.geo_optimizer import (
    haversine_distance, estimate_travel_metrics, optimize_activity_sequence,
    check_opening_hours_validity
)
from app.models.destination import Destination, Place

logger = logging.getLogger(__name__)

class TravelPlannerService:
    """
    TripMind Master Travel Planning & Decision Engine.
    Orchestrates clarification tradeoff questions, multi-approach strategies,
    grounded itinerary synthesis, deterministic geo-routing, and on-the-ground adaptation.
    """

    def __init__(self, provider_override: Optional[str] = None):
        self.provider = get_ai_provider(provider_override)

    async def get_verified_db_places(self, destination_name: str, db: Optional[AsyncSession]) -> List[Place]:
        """Fetch verified places from the database matching the destination name or region."""
        if not db or not destination_name:
            return []
        try:
            dest_query = select(Destination).where(
                Destination.name.ilike(f"%{destination_name.strip()}%") |
                Destination.slug.ilike(f"%{destination_name.strip().lower()}%")
            )
            dest_res = await db.execute(dest_query)
            destination = dest_res.scalars().first()

            if destination:
                places_query = select(Place).where(Place.destination_id == destination.id)
                places_res = await db.execute(places_query)
                return places_res.scalars().all()
        except Exception as e:
            logger.warning(f"Error querying verified DB places: {e}")
        return []

    # =========================================================================
    # 1. SMART CLARIFICATION QUESTIONS
    # =========================================================================
    async def clarify_trip_preferences(self, req: TripClarifyRequest) -> TripClarifyResponse:
        """
        Synthesizes 1 to 3 short, destination-specific tradeoff questions.
        """
        dest = (req.destination or "").strip()
        if not dest or len(dest) < 2:
            raise ValueError("Invalid destination: Destination name must be at least 2 characters.")

        user_prompt = f"""Destination: {dest}
Duration: {req.duration_days} days
Travelers: {req.travelers}
Budget: {req.currency} {req.budget:,.2f}
Pace: {req.pace}
Comfort Tier: {req.comfort}
Interests: {', '.join(req.interests) if req.interests else 'General cultural discovery'}
Food Preferences: {', '.join(req.food_preferences) if req.food_preferences else 'Local authentic cuisine'}
Transport Preference: {req.transport_preference}
Free-text notes: {req.notes or 'None'}

Generate 1-3 destination-tailored multiple choice tradeoff questions."""

        raw_res = await self.provider.generate_structured(
            system_prompt=SYSTEM_CLARIFICATION_PROMPT,
            user_prompt=user_prompt
        )

        questions = []
        for q in raw_res.get("questions", []):
            opts = [ClarificationOption(**o) for o in q.get("options", [])]
            questions.append(
                ClarificationQuestion(
                    id=q.get("id", f"q_{len(questions)+1}"),
                    category=q.get("category", "pacing"),
                    question=q.get("question", "What is your preference?"),
                    options=opts,
                    default_option_id=q.get("default_option_id")
                )
            )

        return TripClarifyResponse(
            destination=raw_res.get("destination", dest.title()),
            questions=questions,
            explanation=raw_res.get("explanation", f"Tradeoff calibration tailored to {dest.title()}.")
        )

    # =========================================================================
    # 2. MULTI-APPROACH STRATEGY SELECTION
    # =========================================================================
    async def generate_strategies(self, req: TripStrategiesRequest) -> TripStrategiesResponse:
        """
        Generates 2 to 3 distinct trip approaches with tradeoffs and budget ranges.
        """
        dest = (req.destination or "").strip()
        if not dest or len(dest) < 2:
            raise ValueError("Invalid destination: Destination name must be at least 2 characters.")
        if req.budget <= 0:
            raise ValueError("Budget must be a positive number.")

        answers_str = "\n".join([f"- {k}: {v}" for k, v in req.clarification_answers.items()]) or "None"

        user_prompt = f"""Destination: {dest}
Duration: {req.duration_days} days
Travelers: {req.travelers}
Budget: {req.currency} {req.budget:,.2f}
Pace: {req.pace}
Comfort Tier: {req.comfort}
Interests: {', '.join(req.interests) if req.interests else 'General exploration'}
Clarification Answers Selected:
{answers_str}

Synthesize 3 distinct comparative trip strategies with explicit tradeoffs."""

        raw_res = await self.provider.generate_structured(
            system_prompt=SYSTEM_STRATEGIES_PROMPT,
            user_prompt=user_prompt
        )

        strategies = []
        for s in raw_res.get("strategies", []):
            strategies.append(
                TripStrategyOption(
                    strategy_id=s.get("strategy_id", "balanced"),
                    name=s.get("name", "Balanced"),
                    tagline=s.get("tagline", "Curated standard"),
                    pace=s.get("pace", "Moderate"),
                    estimated_budget=float(s.get("estimated_budget", req.budget)),
                    currency=req.currency,
                    major_focus=s.get("major_focus", "Key landmarks and local food"),
                    transit_style=s.get("transit_style", "Public transit & walking"),
                    dining_style=s.get("dining_style", "Authentic local bistros"),
                    tradeoffs=s.get("tradeoffs", []),
                    recommended_for=s.get("recommended_for", "General travelers")
                )
            )

        return TripStrategiesResponse(
            destination=raw_res.get("destination", dest.title()),
            strategies=strategies,
            rationale=raw_res.get("rationale", f"Viable travel approaches for {dest.title()}.")
        )

    # =========================================================================
    # 3. STRUCTURED ITINERARY GENERATION & GROUNDING
    # =========================================================================
    async def generate_itinerary(
        self,
        req: TripPlanRequest,
        db: Optional[AsyncSession] = None
    ) -> StructuredItinerary:
        """
        Generates full structured itinerary with verified database place grounding,
        opening hours validation, and deterministic geo-routing.
        """
        dest = (req.destination or "").strip()
        if not dest or len(dest) < 2:
            raise ValueError("Invalid destination: Destination name must be at least 2 characters.")
        if req.duration_days < 1:
            raise ValueError("Duration must be at least 1 day.")
        if req.budget <= 0:
            raise ValueError("Budget must be a positive number.")

        # Check verified DB places
        verified_places = await self.get_verified_db_places(dest, db)
        verified_context = ""
        if verified_places:
            places_summary = "\n".join([
                f"- {p.name}: Lat {p.latitude}, Lon {p.longitude}, Entry Fee ${p.entry_fee}, Hours {p.opening_hours or '09:00 - 18:00'}"
                for p in verified_places[:10]
            ])
            verified_context = f"\nVERIFIED DATABASE PLACES (Must use verified coordinates & fee):\n{places_summary}\n"

        user_prompt = f"""Destination: {dest}
Duration: {req.duration_days} days
Travelers: {req.travelers}
Budget: {req.currency} {req.budget:,.2f}
Strategy Selected: {req.selected_strategy_id}
Pace: {req.pace}
Comfort Tier: {req.comfort}
Interests: {', '.join(req.interests) if req.interests else 'General highlights'}
Food Preferences: {', '.join(req.food_preferences) if req.food_preferences else 'Authentic local cuisine'}
Transport Preference: {req.transport_preference}
Clarification Answers: {req.clarification_answers}
Notes: {req.notes or 'None'}
{verified_context}
Generate a structured day-by-day itinerary strictly adhering to the schema."""

        raw_res = await self.provider.generate_structured(
            system_prompt=SYSTEM_ITINERARY_PROMPT,
            user_prompt=user_prompt
        )

        # Build place lookup dictionary for database grounding
        place_lookup = {p.name.lower(): p for p in verified_places}

        days: List[StructuredDay] = []
        tot_acc = 0.0
        tot_food = 0.0
        tot_trans = 0.0
        tot_att = 0.0
        tot_act = 0.0
        tot_misc = 0.0
        unverified_warnings = list(raw_res.get("unverified_data_warnings", []))

        for d in raw_res.get("days", []):
            d_num = d.get("day_number", len(days) + 1)
            raw_activities = d.get("activities", [])
            activities: List[ActivityItem] = []

            for act in raw_activities:
                p_name = act.get("place_name", "Activity")
                matched_db_place = place_lookup.get(p_name.lower())

                lat = act.get("latitude")
                lon = act.get("longitude")
                cost = float(act.get("estimated_cost", 0.0) or 0.0)
                is_ver = bool(act.get("is_verified", False))
                op_hours = act.get("opening_hours")
                op_ver = bool(act.get("opening_hours_verified", False))
                p_id = act.get("place_id")

                if matched_db_place:
                    lat = matched_db_place.latitude
                    lon = matched_db_place.longitude
                    cost = matched_db_place.entry_fee * req.travelers if matched_db_place.entry_fee > 0 else cost
                    is_ver = True
                    op_hours = matched_db_place.opening_hours
                    op_ver = True
                    p_id = matched_db_place.id

                # Validate opening hours against slot
                time_slot = act.get("time_slot", "morning")
                is_open_valid, hours_warn = check_opening_hours_validity(op_hours, time_slot)
                if not is_open_valid and hours_warn:
                    unverified_warnings.append(f"{p_name}: {hours_warn}")

                activities.append(
                    ActivityItem(
                        id=act.get("id", f"d{d_num}_{len(activities)+1}"),
                        time_slot=time_slot,
                        time_start=act.get("time_start"),
                        item_type=act.get("item_type", "attraction"),
                        place_name=p_name,
                        place_id=p_id,
                        location_name=act.get("location_name", dest.title()),
                        address=act.get("address"),
                        latitude=lat,
                        longitude=lon,
                        duration_hours=float(act.get("duration_hours", 2.0) or 2.0),
                        estimated_cost=cost,
                        currency=req.currency,
                        is_verified=is_ver,
                        travel_time_minutes=int(act.get("travel_time_minutes", 15) or 15),
                        transport_method=act.get("transport_method", "walking"),
                        transport_details=act.get("transport_details"),
                        opening_hours=op_hours,
                        opening_hours_verified=op_ver,
                        reasoning=act.get("reasoning", "Recommended highlight"),
                        tips=act.get("tips")
                    )
                )

            # Deterministic geo-optimization to avoid backtracking
            act_dicts = [a.model_dump() for a in activities]
            optimized_dicts = optimize_activity_sequence(act_dicts)
            activities = [ActivityItem(**item) for item in optimized_dicts]

            # Daily budget calculations
            raw_b = d.get("budget", {})
            b_acc = float(raw_b.get("accommodation", req.budget / req.duration_days * 0.4))
            b_food = float(raw_b.get("food", sum(a.estimated_cost for a in activities if a.item_type in ("restaurant", "cafe")) or 25.0))
            b_trans = float(raw_b.get("transport", 10.0))
            b_att = float(raw_b.get("attractions", sum(a.estimated_cost for a in activities if a.item_type == "attraction") or 15.0))
            b_act = float(raw_b.get("activities", 0.0))
            b_misc = float(raw_b.get("miscellaneous", 5.0))
            b_tot = b_acc + b_food + b_trans + b_att + b_act + b_misc

            tot_acc += b_acc
            tot_food += b_food
            tot_trans += b_trans
            tot_att += b_att
            tot_act += b_act
            tot_misc += b_misc

            v_count = sum(1 for a in activities if a.is_verified)
            v_ratio = round(v_count / max(1, len(activities)), 2)

            days.append(
                StructuredDay(
                    day_number=d_num,
                    date=d.get("date", f"Day {d_num}"),
                    title=d.get("title", f"Day {d_num} in {dest.title()}"),
                    theme=d.get("theme", "Exploration"),
                    activities=activities,
                    budget=DayBudgetBreakdown(
                        accommodation=round(b_acc, 2),
                        food=round(b_food, 2),
                        transport=round(b_trans, 2),
                        attractions=round(b_att, 2),
                        activities=round(b_act, 2),
                        miscellaneous=round(b_misc, 2),
                        total=round(b_tot, 2),
                        is_verified_ratio=v_ratio
                    ),
                    daily_notes=d.get("daily_notes")
                )
            )

        total_calculated = tot_acc + tot_food + tot_trans + tot_att + tot_act + tot_misc

        # Evaluate budget status truthfully
        budget_status = raw_res.get("budget_status", "within_budget")
        budget_advice = raw_res.get("budget_advice")
        if total_calculated > req.budget * 1.15:
            budget_status = "exceeds_budget"
            if not budget_advice:
                budget_advice = f"The estimated trip total ({req.currency} {total_calculated:,.2f}) exceeds your target budget of {req.currency} {req.budget:,.2f}. Consider choosing 'Local Explorer' mode, staying in budget accommodations, or reducing paid museum entries."
        elif total_calculated > req.budget:
            budget_status = "tight"
            if not budget_advice:
                budget_advice = f"Your trip is closely matched to your budget limit ({req.currency} {req.budget:,.2f}). Little margin remains for unplanned purchases."

        if not verified_places:
            unverified_warnings.append(f"Notice: Specific attraction entry fees and opening hours for {dest.title()} are estimated from travel catalog heuristics and could not be verified against official live APIs.")

        return StructuredItinerary(
            title=raw_res.get("title", f"Trip to {dest.title()}"),
            destination=dest.title(),
            duration_days=req.duration_days,
            strategy_used=req.selected_strategy_id,
            summary=raw_res.get("summary", f"Custom travel plan for {dest.title()}."),
            total_budget=round(total_calculated, 2),
            currency=req.currency,
            budget_summary=DayBudgetBreakdown(
                accommodation=round(tot_acc, 2),
                food=round(tot_food, 2),
                transport=round(tot_trans, 2),
                attractions=round(tot_att, 2),
                activities=round(tot_act, 2),
                miscellaneous=round(tot_misc, 2),
                total=round(total_calculated, 2),
                is_verified_ratio=0.5
            ),
            budget_status=budget_status,
            budget_advice=budget_advice,
            days=days,
            packing_tips=raw_res.get("packing_tips", ["Passport and copies", "Comfortable walking shoes", "Universal adapter"]),
            visa_and_entry_info=raw_res.get("visa_and_entry_info", "Ensure passport has at least 6 months validity."),
            local_transit_tips=raw_res.get("local_transit_tips", "Use local transit cards or licensed taxis."),
            emergency_contacts=raw_res.get("emergency_contacts", {"police": "102 / 112", "medical": "103"}),
            unverified_data_warnings=list(set(unverified_warnings)),
            matched_tours_count=raw_res.get("matched_tours_count", 3)
        )

    # =========================================================================
    # 4. IN-TRIP REAL-TIME ADAPTATION
    # =========================================================================
    async def adapt_itinerary(
        self,
        req: TripAdaptationRequest,
        db: Optional[AsyncSession] = None
    ) -> TripAdaptationResponse:
        """
        Dynamically mutates uncompleted activities for the active day without destroying future days.
        """
        prompt = (req.prompt or "").strip()
        if not prompt:
            raise ValueError("Adaptation prompt cannot be empty.")

        user_prompt = f"""Trigger Prompt: "{prompt}"
Current Day: {req.current_day}
Current Time Slot: {req.current_slot}
Remaining Budget Today: {req.remaining_budget_today}
Coordinates: {req.current_coordinates}
Existing Itinerary Context: {req.existing_itinerary or 'Active travel day'}

Propose a schedule mutation without wiping future bookings."""

        raw_res = await self.provider.generate_structured(
            system_prompt=SYSTEM_ADAPTATION_PROMPT,
            user_prompt=user_prompt
        )

        mut_data = raw_res.get("mutation", {})
        added_acts = [ActivityItem(**a) for a in mut_data.get("added_activities", [])]

        mutation = ScheduleMutation(
            removed_activities=mut_data.get("removed_activities", []),
            added_activities=added_acts,
            modified_activities=mut_data.get("modified_activities", []),
            budget_delta=float(mut_data.get("budget_delta", 0.0)),
            walking_distance_saved_km=float(mut_data.get("walking_distance_saved_km", 0.0)),
            explanation=mut_data.get("explanation", "Schedule adjusted to your current situation.")
        )

        raw_day = raw_res.get("updated_day", {})
        day_budget = raw_day.get("budget", {})

        updated_day = StructuredDay(
            day_number=raw_day.get("day_number", req.current_day),
            date=raw_day.get("date", f"Day {req.current_day} (Adapted)"),
            title=raw_day.get("title", f"Day {req.current_day} (Adapted)"),
            theme=raw_day.get("theme", "Adapted Route"),
            activities=added_acts,
            budget=DayBudgetBreakdown(
                accommodation=float(day_budget.get("accommodation", 40.0)),
                food=float(day_budget.get("food", 25.0)),
                transport=float(day_budget.get("transport", 5.0)),
                attractions=float(day_budget.get("attractions", 10.0)),
                activities=float(day_budget.get("activities", 0.0)),
                miscellaneous=float(day_budget.get("miscellaneous", 5.0)),
                total=float(day_budget.get("total", 85.0)),
                is_verified_ratio=0.5
            ),
            daily_notes=raw_day.get("daily_notes")
        )

        return TripAdaptationResponse(
            trigger_prompt=prompt,
            diagnosis=raw_res.get("diagnosis", "Adaptive pivot triggered."),
            mutation=mutation,
            updated_day=updated_day,
            updated_itinerary=raw_res.get("updated_itinerary")
        )

    # =========================================================================
    # 5. LOCATION-AWARE ASSISTANT QUERY
    # =========================================================================
    async def location_aware_query(
        self,
        req: LocationAwareQueryRequest,
        db: Optional[AsyncSession] = None
    ) -> LocationAwareQueryResponse:
        """
        Answers location-aware queries on the ground truthfully.
        """
        q = (req.query or "").strip()
        if not q:
            raise ValueError("Query cannot be empty.")

        user_prompt = f"""Query: "{q}"
Destination: {req.destination or 'Current Location'}
Latitude: {req.latitude}
Longitude: {req.longitude}
Current Time: {req.current_time or 'Daytime'}
Max Budget: {req.max_budget}

Answer the query truthfully with actionable guidance."""

        raw_res = await self.provider.generate_structured(
            system_prompt=SYSTEM_LOCATION_AGENT_PROMPT,
            user_prompt=user_prompt
        )

        return LocationAwareQueryResponse(
            query=q,
            detected_intent=raw_res.get("detected_intent", "general_advice"),
            answer=raw_res.get("answer", "Here is what you can do near your current location."),
            recommendations=raw_res.get("recommendations", []),
            verified=bool(raw_res.get("verified", False)),
            data_limitations=raw_res.get("data_limitations")
        )
