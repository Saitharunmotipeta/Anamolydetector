#!/usr/bin/env python3
"""
generate_logs.py
Create a realistic, non-flat log file for testing anomaly detection.
Outputs a single plain-text file (one logline per line).
"""

import argparse
import random
from datetime import datetime, timedelta
import math

ENDPOINTS = [
    ("/api/search", "Search OK"),
    ("/api/login", "Login OK"),
    ("/telemetry/ingest", "Stream heartbeat OK"),
    ("/sensor/upload", "Gyro data packet received"),
    ("/compute/node", "GPU batch processed"),
    ("/ops/delete-task", "Task purge requested"),
    ("/ops/diagnostics", "System diagnostics triggered"),
    ("/relay/marslink", "Relay ok"),
    ("/crew/status", "Crew heartbeats OK"),
    ("/proc/fuel", "Fuel telemetry OK")
]

LEVELS = ["INFO", "WARN", "ERROR", "CRITICAL"]
IPS = [
    "10.21.3.4", "172.16.9.20", "192.168.55.12", "172.31.8.90",
    "10.0.0.100", "127.0.0.1", "192.168.1.10", "10.30.0.12",
    "172.20.5.20", "10.21.7.8"
]

def iso(ts):
    return ts.strftime("%Y-%m-%dT%H:%M:%SZ")

def sample_response_time(base=0.12, variance=0.05, spike_factor=1.0):
    # log-normal-ish jitter + optional spike multiplier
    val = abs(random.gauss(base, variance))
    return round(val * spike_factor + random.random() * 0.001, 3)

def status_for_level(level):
    if level == "INFO": return 200
    if level == "WARN": return random.choice([200,400,429])
    if level == "ERROR": return random.choice([400,500,502,500])
    if level == "CRITICAL": return random.choice([502,503,504])

def generate_logs(start_ts, lines=50, out_path="logs.txt",
                  base_rate_per_min=10,
                  burst_windows=None,
                  ip_flood=None,
                  seq_anomalies=None):
    """
    burst_windows: list of (start_offset_minutes, duration_minutes, intensity_factor, spike_factor)
    ip_flood: dict ip->(start_min, duration_min, hits_per_min)
    seq_anomalies: list of dicts {ip, at_min, seq: [endpoints]}
    """
    if burst_windows is None:
        burst_windows = []
    if ip_flood is None:
        ip_flood = {}
    if seq_anomalies is None:
        seq_anomalies = []

    lines_written = 0
    current = start_ts
    minute = 0

    with open(out_path, "w", encoding="utf-8") as f:
        while lines_written < lines:
            # determine rate for this minute
            rate = base_rate_per_min
            spike_factor = 1.0
            for s_off, dur, intensity, spk in burst_windows:
                if s_off <= minute < s_off + dur:
                    rate = int(rate * intensity)
                    spike_factor = spk

            # ip flood extra hits
            extra_hits = []
            for ip, (s_off, dur, hits_min) in ip_flood.items():
                if s_off <= minute < s_off + dur:
                    extra_hits += [ip] * hits_min

            # produce Poisson-like count for this minute
            count = max(0, int(random.poissonvariate(rate)) if hasattr(random, "poissonvariate") else
                        int(random.expovariate(1.0 / max(1, rate)) + rate/2))

            # Add extra hits from ip_flood
            count += len(extra_hits)

            # create events across the minute
            for i in range(count):
                # jitter second within minute
                ts = current + timedelta(seconds=random.randint(0,59))
                # choose endpoint (bias some endpoints)
                ep_choice = random.choices(
                    population=[e for e,_ in ENDPOINTS],
                    weights=[5,3,6,3,2,1,1,1,2,1],
                    k=1
                )[0]
                # base message
                msg = dict(ENDPOINTS)[ep_choice] if ep_choice in dict(ENDPOINTS) else "OK"
                level = "INFO"
                resp_time = sample_response_time(base=0.12, variance=0.07, spike_factor=1.0)

                # introduce burst-related latency / errors
                if random.random() < 0.02 * spike_factor:
                    # rare big latency
                    resp_time = sample_response_time(base=2.5, variance=0.8, spike_factor=1.0)
                    level = "WARN" if resp_time < 3 else "ERROR"
                    msg = "Sudden spike in latency"

                # some endpoints more error-prone
                if ep_choice in ("/telemetry/ingest", "/relay/marslink") and random.random() < 0.03*spike_factor:
                    level = "ERROR"
                    resp_time = sample_response_time(base=3.0, variance=1.0)
                    msg = "Lost sync / Relay timeout"

                # simulated login failures cluster
                if ep_choice == "/api/login" and random.random() < 0.05*spike_factor:
                    level = random.choices(["ERROR","CRITICAL"], weights=[4,1])[0]
                    resp_time = sample_response_time(base=0.4, variance=0.2)
                    msg = "Invalid operator PIN" if random.random() < 0.6 else "Service down"

                ip = random.choice(IPS)
                # if this minute has IP flood extras, pop one
                if extra_hits:
                    ip = extra_hits.pop() if extra_hits else ip

                status = status_for_level(level)

                line = f"{iso(ts)} {level} {ep_choice} {status} {resp_time:.3f} {ip} - {msg}\n"
                f.write(line)
                lines_written += 1
                if lines_written >= lines:
                    break

            # handle sequence anomalies injected at specific minutes
            for seq in seq_anomalies:
                if seq["at_min"] == minute:
                    ip_seq = seq.get("ip", random.choice(IPS))
                    for ep in seq["seq"]:
                        ts = current + timedelta(seconds=random.randint(0,59))
                        level = "INFO"
                        if "delete" in ep: level = "INFO"
                        if "diagnostics" in ep and random.random() < 0.4: level = "WARN"
                        status = status_for_level(level)
                        resp_time = sample_response_time(base=0.2, variance=0.05)
                        msg = f"Auto-generated seq event for {ep}"
                        f.write(f"{iso(ts)} {level} {ep} {status} {resp_time:.3f} {ip_seq} - {msg}\n")
                        lines_written += 1

            # step one minute
            current += timedelta(minutes=1)
            minute += 1

    print(f"Wrote {lines_written} lines to {out_path}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--lines", type=int, default=100)
    parser.add_argument("--out", "--outpath", dest="out", default="logs.txt")
    args = parser.parse_args()

    start = datetime.utcnow() - timedelta(hours=3)  # recent 3 hours
    # example bursts + ip floods + sequence injections
    bursts = [
        (10, 6, 8, 3.0),   # big burst starting 10 minutes after start, lasts 6 minutes
        (35, 4, 5, 2.8),   # smaller burst later
        (90, 8, 10, 3.5)   # long outage-like burst
    ]
    ip_f = {
        "10.21.3.4": (10, 12, 20),   # heavy IP flood during first burst
        "10.0.0.100": (88, 10, 6)
    }
    seqs = [
        {"at_min": 12, "ip": "10.0.0.100", "seq": ["/ops/delete-task", "/auth/login", "/ops/diagnostics"]},
        {"at_min": 92, "ip": "10.21.7.8", "seq": ["/api/delete", "/api/login", "/ops/diagnostics"]}
    ]
    generate_logs(start_ts=start, lines=args.lines, out_path=args.out,
                  base_rate_per_min=12, burst_windows=bursts, ip_flood=ip_f, seq_anomalies=seqs)
