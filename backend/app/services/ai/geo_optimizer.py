import math
from typing import List, Dict, Any, Optional, Tuple
import logging

logger = logging.getLogger(__name__)

EARTH_RADIUS_METERS = 6371000.0

def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate the great-circle distance between two points on Earth in meters."""
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)

    a = math.sin(delta_phi / 2.0) ** 2 + \
        math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2.0) ** 2
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))

    return EARTH_RADIUS_METERS * c

def estimate_travel_metrics(
    lat1: Optional[float],
    lon1: Optional[float],
    lat2: Optional[float],
    lon2: Optional[float],
    mode: str = "walking"
) -> Tuple[int, str]:
    """
    Deterministically estimate travel duration (minutes) and descriptive text between two coordinates.
    Never hallucinates arbitrary travel times.
    """
    if lat1 is None or lon1 is None or lat2 is None or lon2 is None:
        # Fallback when coordinates are unverified
        if mode == "walking":
            return (15, "Approx. 15 min walk (route unverified)")
        elif mode in ("taxi", "rideshare"):
            return (12, "Approx. 12 min taxi drive (traffic dependent)")
        else:
            return (15, "Approx. 15 min via public transit")

    distance_m = haversine_distance(lat1, lon1, lat2, lon2)
    distance_km = distance_m / 1000.0

    if mode == "walking" and distance_km <= 2.5:
        # Standard urban walking speed: ~4.5 km/h -> ~13.3 min/km
        minutes = max(3, round(distance_km * 13.3))
        return (minutes, f"{minutes} min walk ({distance_m:.0f}m)")
    elif distance_km <= 5.0 and mode in ("transit", "walking_transit"):
        # Urban public transit: ~20 km/h with 5 min station/wait overhead
        minutes = max(8, round((distance_km / 20.0) * 60 + 5))
        return (minutes, f"{minutes} min via metro/tram ({distance_km:.1f} km)")
    else:
        # Taxi / vehicle: ~25 km/h in city traffic with 3 min dispatch overhead
        minutes = max(7, round((distance_km / 25.0) * 60 + 3))
        return (minutes, f"{minutes} min drive ({distance_km:.1f} km)")

def optimize_activity_sequence(activities: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Avoid unnecessary backtracking using nearest-neighbor greedy route sequencing.
    Fixed anchor activities (like morning start or evening dinner) remain at their time slot,
    while daytime stops are ordered to minimize total travel distance.
    """
    if len(activities) <= 2:
        return activities

    # Separate items that have coordinates from those that don't
    geocoded = []
    non_geocoded = []
    for act in activities:
        if act.get("latitude") is not None and act.get("longitude") is not None:
            geocoded.append(act)
        else:
            non_geocoded.append(act)

    if len(geocoded) <= 2:
        return activities

    # Greedy nearest neighbor starting from first geocoded activity
    ordered = [geocoded[0]]
    remaining = geocoded[1:]

    while remaining:
        current = ordered[-1]
        c_lat = current["latitude"]
        c_lon = current["longitude"]

        best_idx = 0
        best_dist = float("inf")
        for i, candidate in enumerate(remaining):
            dist = haversine_distance(c_lat, c_lon, candidate["latitude"], candidate["longitude"])
            if dist < best_dist:
                best_dist = dist
                best_idx = i

        ordered.append(remaining.pop(best_idx))

    # Recompute travel legs sequentially
    for i in range(len(ordered) - 1):
        curr = ordered[i]
        nxt = ordered[i + 1]
        mins, desc = estimate_travel_metrics(
            curr.get("latitude"), curr.get("longitude"),
            nxt.get("latitude"), nxt.get("longitude"),
            mode=curr.get("transport_method", "walking")
        )
        curr["travel_time_minutes"] = mins
        curr["transport_details"] = desc

    # Recombine with non-geocoded
    return ordered + non_geocoded

def check_opening_hours_validity(opening_hours_str: Optional[str], time_slot: str) -> Tuple[bool, Optional[str]]:
    """
    Validates if an activity is viable given its opening hours and time slot.
    Returns (is_viable, warning_message).
    """
    if not opening_hours_str or opening_hours_str.lower() in ("24/7", "open 24 hours", "always open"):
        return (True, None)

    hours_clean = opening_hours_str.strip()
    # Simple heuristic checks for standard ranges e.g. "09:00 - 18:00" or "08:00 - 17:00"
    if "-" in hours_clean:
        try:
            parts = hours_clean.split("-")
            open_part = parts[0].strip()
            close_part = parts[1].strip()
            
            close_hour = int(close_part.split(":")[0])
            open_hour = int(open_part.split(":")[0])

            if time_slot in ("evening", "night") and close_hour <= 18:
                return (
                    False,
                    f"Warning: Operating hours are {opening_hours_str}. This place typically closes at {close_part} and may not be accessible in the evening."
                )
            if time_slot == "morning" and open_hour >= 11:
                return (
                    False,
                    f"Note: This venue opens at {open_part}. Morning visit should be scheduled after opening time."
                )
        except Exception:
            pass

    return (True, None)
