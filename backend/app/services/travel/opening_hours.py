import re
import logging
from datetime import datetime, time
from typing import Optional, Union, Dict, Any, List, Tuple
from zoneinfo import ZoneInfo, ZoneInfoNotFoundError

from app.schemas.travel import OpeningHoursStatus

logger = logging.getLogger(__name__)

# Standard coordinate bounding boxes to primary IANA timezones fallback
COORDINATE_TIMEZONE_MAP: List[Tuple[float, float, float, float, str]] = [
    # (min_lat, max_lat, min_lng, max_lng, timezone)
    (37.0, 45.6, 55.9, 73.2, "Asia/Tashkent"),      # Uzbekistan / Central Asia
    (48.7, 49.0, 2.1, 2.6, "Europe/Paris"),          # Paris / France
    (51.2, 51.7, -0.6, 0.3, "Europe/London"),        # London / UK
    (35.5, 35.9, 139.5, 140.0, "Asia/Tokyo"),        # Tokyo / Japan
    (40.5, 40.9, -74.3, -73.7, "America/New_York"),  # New York / US
    (41.0, 42.1, 12.3, 12.7, "Europe/Rome"),         # Rome / Italy
    (40.8, 41.3, 28.7, 29.3, "Europe/Istanbul"),     # Istanbul / Turkey
    (41.3, 41.5, 2.0, 2.3, "Europe/Barcelona"),      # Barcelona / Spain
    (24.8, 25.4, 55.0, 55.6, "Asia/Dubai"),          # Dubai / UAE
    (34.9, 35.1, 135.6, 135.9, "Asia/Tokyo"),        # Kyoto / Japan
]

CITY_TIMEZONE_MAP: Dict[str, str] = {
    "samarkand": "Asia/Samarkand",
    "tashkent": "Asia/Tashkent",
    "bukhara": "Asia/Samarkand",
    "khiva": "Asia/Samarkand",
    "paris": "Europe/Paris",
    "london": "Europe/London",
    "tokyo": "Asia/Tokyo",
    "new york": "America/New_York",
    "rome": "Europe/Rome",
    "istanbul": "Europe/Istanbul",
    "barcelona": "Europe/Madrid",
    "madrid": "Europe/Madrid",
    "dubai": "Asia/Dubai",
    "kyoto": "Asia/Tokyo",
}

def resolve_timezone(
    timezone_name: Optional[str] = None,
    lat: Optional[float] = None,
    lng: Optional[float] = None,
    city: Optional[str] = None
) -> ZoneInfo:
    """
    Resolve IANA ZoneInfo safely from timezone string, city name, or lat/lng.
    Defaults to UTC only when no specific location context can be resolved.
    """
    if timezone_name:
        try:
            return ZoneInfo(timezone_name)
        except (ZoneInfoNotFoundError, ValueError):
            pass

    if city:
        city_clean = city.strip().lower()
        for k, tz in CITY_TIMEZONE_MAP.items():
            if k in city_clean:
                try:
                    return ZoneInfo(tz)
                except (ZoneInfoNotFoundError, ValueError):
                    pass

    if lat is not None and lng is not None:
        for min_lat, max_lat, min_lng, max_lng, tz in COORDINATE_TIMEZONE_MAP:
            if min_lat <= lat <= max_lat and min_lng <= lng <= max_lng:
                try:
                    return ZoneInfo(tz)
                except (ZoneInfoNotFoundError, ValueError):
                    pass

    # Default fallback
    return ZoneInfo("UTC")

def parse_time_str(t_str: str) -> Optional[time]:
    """Parse time string like '09:00', '18:30', '9:00 AM', '6:00 PM', '0900'."""
    s = t_str.strip().upper()
    # Check AM/PM
    is_pm = "PM" in s
    is_am = "AM" in s
    s = s.replace("AM", "").replace("PM", "").strip()

    # Formats: 09:00 or 9:00
    if ":" in s:
        parts = s.split(":")
        try:
            h = int(parts[0])
            m = int(parts[1]) if len(parts) > 1 else 0
            if is_pm and h < 12:
                h += 12
            elif is_am and h == 12:
                h = 0
            return time(h, m)
        except ValueError:
            return None

    # Format 0900
    if len(s) == 4 and s.isdigit():
        try:
            h = int(s[:2])
            m = int(s[2:])
            return time(h, m)
        except ValueError:
            return None

    return None

def evaluate_opening_hours(
    opening_hours_raw: Optional[Union[str, dict, list]],
    timezone_name: Optional[str] = None,
    lat: Optional[float] = None,
    lng: Optional[float] = None,
    city: Optional[str] = None,
    reference_dt: Optional[datetime] = None
) -> OpeningHoursStatus:
    """
    Evaluates whether a place is currently open or closed based on its local timezone.
    Strictly factual:
    - Never fabricates 'Open now' / 'Closed' when data is missing or ambiguous.
    - Calculates against local destination wall-clock time, not server UTC.
    """
    tz = resolve_timezone(timezone_name, lat, lng, city)
    current_local_dt = reference_dt.astimezone(tz) if reference_dt else datetime.now(tz)
    local_time_str = current_local_dt.strftime("%H:%M")
    local_day_idx = current_local_dt.weekday()  # Monday = 0, Sunday = 6
    tz_label = str(tz)

    if not opening_hours_raw:
        return OpeningHoursStatus(
            has_reliable_hours=False,
            is_open_now=None,
            status="unknown",
            status_label="Hours not verified",
            local_time=local_time_str,
            local_timezone=tz_label,
            raw_hours=None
        )

    # 1. Structured Google Places periods: list of dicts with open/close
    if isinstance(opening_hours_raw, list):
        # Check if structured period dicts
        has_periods = all(isinstance(p, dict) and "open" in p for p in opening_hours_raw)
        if has_periods:
            return _evaluate_google_periods(opening_hours_raw, current_local_dt, tz_label)

    # 2. String representation
    raw_str = str(opening_hours_raw).strip()
    raw_lower = raw_str.lower()

    if raw_lower in ("24/7", "open 24 hours", "24 hours", "open 24/7"):
        return OpeningHoursStatus(
            has_reliable_hours=True,
            is_open_now=True,
            status="open",
            status_label="Open now (24/7)",
            local_time=local_time_str,
            local_timezone=tz_label,
            next_change="Open 24 hours",
            raw_hours=raw_str
        )

    if raw_lower in ("closed", "permanently closed", "temporarily closed"):
        return OpeningHoursStatus(
            has_reliable_hours=True,
            is_open_now=False,
            status="closed",
            status_label="Closed",
            local_time=local_time_str,
            local_timezone=tz_label,
            next_change=None,
            raw_hours=raw_str
        )

    # Check for day-specific schedule e.g. "Mon-Fri: 09:00 - 18:00, Sat: 10:00 - 16:00, Sun: Closed"
    if any(day_str in raw_lower for day_str in ["mon", "tue", "wed", "thu", "fri", "sat", "sun"]):
        day_schedule = _extract_today_from_multiday_string(raw_str, local_day_idx)
        if day_schedule:
            if day_schedule.lower() == "closed":
                return OpeningHoursStatus(
                    has_reliable_hours=True,
                    is_open_now=False,
                    status="closed",
                    status_label="Closed today",
                    local_time=local_time_str,
                    local_timezone=tz_label,
                    raw_hours=raw_str
                )
            return _evaluate_simple_range(day_schedule, current_local_dt, tz_label, raw_str)

    # Simple range e.g. "09:00 - 18:00" or "08:30 – 19:00" or "9:00 AM - 5:00 PM"
    if "-" in raw_str or "–" in raw_str or "to" in raw_lower:
        return _evaluate_simple_range(raw_str, current_local_dt, tz_label, raw_str)

    # If unparseable or ambiguous, return unknown
    return OpeningHoursStatus(
        has_reliable_hours=False,
        is_open_now=None,
        status="unknown",
        status_label="Hours not verified",
        local_time=local_time_str,
        local_timezone=tz_label,
        raw_hours=raw_str
    )

def _evaluate_simple_range(
    range_str: str,
    local_dt: datetime,
    tz_label: str,
    full_raw_str: str
) -> OpeningHoursStatus:
    # Normalize dash
    s = range_str.replace("–", "-").replace("—", "-").replace(" to ", "-")
    parts = s.split("-")
    if len(parts) != 2:
        return OpeningHoursStatus(
            has_reliable_hours=False,
            is_open_now=None,
            status="unknown",
            status_label="Hours not verified",
            local_time=local_dt.strftime("%H:%M"),
            local_timezone=tz_label,
            raw_hours=full_raw_str
        )

    t_open = parse_time_str(parts[0])
    t_close = parse_time_str(parts[1])

    if not t_open or not t_close:
        return OpeningHoursStatus(
            has_reliable_hours=False,
            is_open_now=None,
            status="unknown",
            status_label="Hours not verified",
            local_time=local_dt.strftime("%H:%M"),
            local_timezone=tz_label,
            raw_hours=full_raw_str
        )

    curr_t = local_dt.time()

    # Normal range (e.g. 09:00 to 18:00)
    if t_open <= t_close:
        is_open = (t_open <= curr_t < t_close)
        if is_open:
            next_change = f"Closes at {t_close.strftime('%H:%M')}"
            status_label = "Open now"
            status = "open"
        else:
            if curr_t < t_open:
                next_change = f"Opens today at {t_open.strftime('%H:%M')}"
            else:
                next_change = f"Opens tomorrow at {t_open.strftime('%H:%M')}"
            status_label = "Closed"
            status = "closed"
    else:
        # Overnight range (e.g. 18:00 to 02:00)
        is_open = (curr_t >= t_open or curr_t < t_close)
        if is_open:
            next_change = f"Closes at {t_close.strftime('%H:%M')}"
            status_label = "Open now"
            status = "open"
        else:
            next_change = f"Opens today at {t_open.strftime('%H:%M')}"
            status_label = "Closed"
            status = "closed"

    return OpeningHoursStatus(
        has_reliable_hours=True,
        is_open_now=is_open,
        status=status,
        status_label=status_label,
        local_time=local_dt.strftime("%H:%M"),
        local_timezone=tz_label,
        next_change=next_change,
        raw_hours=full_raw_str
    )

def _extract_today_from_multiday_string(s: str, day_idx: int) -> Optional[str]:
    """Extract today's schedule from a schedule string. Monday=0, Sunday=6."""
    day_names = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"]
    today_name = day_names[day_idx]

    # Split by comma or semicolon
    chunks = re.split(r"[,;\n]", s)
    for chunk in chunks:
        c_lower = chunk.lower()
        if today_name in c_lower:
            parts = chunk.split(":")
            if len(parts) >= 2:
                return ":".join(parts[1:]).strip()
            return chunk.strip()
        # Check range e.g. Mon-Fri
        if "-" in c_lower:
            m = re.search(r"(mon|tue|wed|thu|fri|sat|sun)\s*-\s*(mon|tue|wed|thu|fri|sat|sun)", c_lower)
            if m:
                start_day = day_names.index(m.group(1))
                end_day = day_names.index(m.group(2))
                in_range = False
                if start_day <= end_day:
                    in_range = (start_day <= day_idx <= end_day)
                else:
                    in_range = (day_idx >= start_day or day_idx <= end_day)
                if in_range:
                    parts = chunk.split(":")
                    if len(parts) >= 2:
                        return ":".join(parts[1:]).strip()
                    return chunk.strip()
    return None

def _evaluate_google_periods(
    periods: List[Dict[str, Any]],
    local_dt: datetime,
    tz_label: str
) -> OpeningHoursStatus:
    # Google day index: 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    # Python weekday: 0 = Monday, 6 = Sunday
    py_to_g_day = (local_dt.weekday() + 1) % 7
    curr_time_str = local_dt.strftime("%H%M")

    for period in periods:
        open_info = period.get("open", {})
        close_info = period.get("close", {})
        open_day = open_info.get("day")
        open_time = open_info.get("time", "0000")

        # 24/7 period is day 0 with time 0000 and no close
        if open_day == 0 and open_time == "0000" and not close_info:
            return OpeningHoursStatus(
                has_reliable_hours=True,
                is_open_now=True,
                status="open",
                status_label="Open now (24/7)",
                local_time=local_dt.strftime("%H:%M"),
                local_timezone=tz_label,
                next_change="Open 24 hours"
            )

        if open_day == py_to_g_day:
            close_day = close_info.get("day", open_day)
            close_time = close_info.get("time", "2359")

            if open_time <= close_time:
                is_open = (open_time <= curr_time_str < close_time)
                formatted_close = f"{close_time[:2]}:{close_time[2:]}"
                formatted_open = f"{open_time[:2]}:{open_time[2:]}"
                if is_open:
                    return OpeningHoursStatus(
                        has_reliable_hours=True,
                        is_open_now=True,
                        status="open",
                        status_label="Open now",
                        local_time=local_dt.strftime("%H:%M"),
                        local_timezone=tz_label,
                        next_change=f"Closes at {formatted_close}"
                    )
                elif curr_time_str < open_time:
                    return OpeningHoursStatus(
                        has_reliable_hours=True,
                        is_open_now=False,
                        status="closed",
                        status_label="Closed",
                        local_time=local_dt.strftime("%H:%M"),
                        local_timezone=tz_label,
                        next_change=f"Opens today at {formatted_open}"
                    )

    # Not currently matched as open
    return OpeningHoursStatus(
        has_reliable_hours=True,
        is_open_now=False,
        status="closed",
        status_label="Closed",
        local_time=local_dt.strftime("%H:%M"),
        local_timezone=tz_label,
        next_change=None
    )
