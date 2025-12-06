import re
from datetime import datetime
from typing import List, Dict

# FULL FORMAT (with IP + message)
FULL_PATTERN = re.compile(
    r'(?P<timestamp>\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z)\s+'
    r'(?P<level>[A-Z]+)\s+'
    r'(?P<endpoint>\S+)\s+'
    r'(?P<status>\d{3})\s+'
    r'(?P<response_time>[0-9.]+)\s+'
    r'(?P<ip>\S+)\s+-\s+(?P<message>.*)'
)

# SHORT FORMAT (no IP, no message)
SHORT_PATTERN = re.compile(
    r'(?P<timestamp>\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z)\s+'
    r'(?P<level>[A-Z]+)\s+'
    r'(?P<endpoint>\S+)\s+'
    r'(?P<status>\d{3})\s+'
    r'(?P<response_time>[0-9.]+)$'
)

def parse_log_line(line: str) -> Dict:
    text = line.strip()

    # 1️⃣ Try full match
    m = FULL_PATTERN.match(text)
    if m:
        gd = m.groupdict()
        return {
            "timestamp": datetime.fromisoformat(gd["timestamp"].replace("Z", "+00:00")),
            "level": gd["level"],
            "endpoint": gd["endpoint"],
            "status": int(gd["status"]),
            "response_time": float(gd["response_time"]),
            "ip": gd["ip"],
            "message": gd["message"],
        }

    # 2️⃣ Try short match
    m2 = SHORT_PATTERN.match(text)
    if m2:
        gd = m2.groupdict()
        return {
            "timestamp": datetime.fromisoformat(gd["timestamp"].replace("Z", "+00:00")),
            "level": gd["level"],
            "endpoint": gd["endpoint"],
            "status": int(gd["status"]),
            "response_time": float(gd["response_time"]),
            "ip": None,
            "message": None,
        }

    # 3️⃣ Fallback (garbage or comment lines)
    if text.startswith("#"):
        return None  # skip comment lines

    parts = text.split(" ", 3)
    return {
        "timestamp": datetime.utcnow(),
        "level": parts[1] if len(parts) > 1 else "INFO",
        "endpoint": None,
        "status": None,
        "response_time": None,
        "ip": None,
        "message": parts[-1] if parts else text,
    }


def parse_log_file(text: str) -> List[Dict]:
    parsed = []
    for line in text.splitlines():
        if not line.strip():
            continue
        item = parse_log_line(line)
        if item:
            parsed.append(item)
    return parsed
