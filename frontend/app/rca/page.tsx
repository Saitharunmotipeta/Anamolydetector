"use client";

import { useState } from "react";

type RCAResponse = {
  root_cause: string;
  impact: string;
  affected_endpoints: string[];
  recommended_actions: string[];
  risk_level: "low" | "medium" | "high" | "critical";
  confidence: number;
};

type RCAResultPayload = {
  rca: RCAResponse;
  context_used: any;
};

const STATIC_RCA: RCAResultPayload = {
  rca: {
    root_cause:
      "Widespread synchronization and latency issues across telemetry and communication systems",
    impact:
      "Potential disruption of mission-critical communication and data transmission",
    affected_endpoints: [
      "/telemetry/ingest",
      "/relay/marslink",
      "/api/login",
      "/api/search",
    ],
    recommended_actions: [
      "Investigate network connectivity between nodes",
      "Check relay synchronization protocols",
      "Perform comprehensive system diagnostics",
      "Review and potentially reset communication timeouts",
      "Validate network infrastructure and routing",
    ],
    risk_level: "high",
    confidence: 0.85,
  },
  context_used: {
    top_logs: [{
          "timestamp": "2026-01-02 07:47:05",
          "endpoint": "/telemetry/ingest",
          "level": "ERROR",
          "message": "Lost sync / Relay timeout",
          "response_time": 5.609,
          "ip": "10.21.3.4"
        },
        {
          "timestamp": "2026-01-02 07:47:00",
          "endpoint": "/telemetry/ingest",
          "level": "ERROR",
          "message": "Sudden spike in latency",
          "response_time": 3.479,
          "ip": "10.0.0.100"
        },
        {
          "timestamp": "2026-01-02 07:46:58",
          "endpoint": "/relay/marslink",
          "level": "ERROR",
          "message": "Lost sync / Relay timeout",
          "response_time": 4.998,
          "ip": "10.21.7.8"
        },
        {
          "timestamp": "2026-01-02 07:46:54",
          "endpoint": "/telemetry/ingest",
          "level": "ERROR",
          "message": "Sudden spike in latency",
          "response_time": 4.039,
          "ip": "10.0.0.100"
        },
        {
          "timestamp": "2026-01-02 07:46:39",
          "endpoint": "/api/search",
          "level": "ERROR",
          "message": "Sudden spike in latency",
          "response_time": 3.898,
          "ip": "10.30.0.12"
        },
        {
          "timestamp": "2026-01-02 07:46:37",
          "endpoint": "/telemetry/ingest",
          "level": "ERROR",
          "message": "Lost sync / Relay timeout",
          "response_time": 2.089,
          "ip": "172.31.8.90"
        },
        {
          "timestamp": "2026-01-02 07:46:30",
          "endpoint": "/telemetry/ingest",
          "level": "ERROR",
          "message": "Lost sync / Relay timeout",
          "response_time": 2.671,
          "ip": "192.168.1.10"
        },
        {
          "timestamp": "2026-01-02 07:46:25",
          "endpoint": "/api/login",
          "level": "ERROR",
          "message": "Service down",
          "response_time": 0.122,
          "ip": "172.16.9.20"
        },
        {
          "timestamp": "2026-01-02 07:46:17",
          "endpoint": "/telemetry/ingest",
          "level": "ERROR",
          "message": "Lost sync / Relay timeout",
          "response_time": 5.296,
          "ip": "10.21.3.4"
        },
        {
          "timestamp": "2026-01-02 07:46:17",
          "endpoint": "/telemetry/ingest",
          "level": "ERROR",
          "message": "Sudden spike in latency",
          "response_time": 3.634,
          "ip": "10.21.3.4"
        },
        {
          "timestamp": "2026-01-02 07:46:16",
          "endpoint": "/api/search",
          "level": "ERROR",
          "message": "Sudden spike in latency",
          "response_time": 3.088,
          "ip": "10.21.3.4"
        },
        {
          "timestamp": "2026-01-02 07:46:14",
          "endpoint": "/relay/marslink",
          "level": "ERROR",
          "message": "Lost sync / Relay timeout",
          "response_time": 3.417,
          "ip": "172.20.5.20"
        },
        {
          "timestamp": "2026-01-02 07:46:13",
          "endpoint": "/api/login",
          "level": "CRITICAL",
          "message": "Service down",
          "response_time": 0.051,
          "ip": "10.21.3.4"
        },
        {
          "timestamp": "2026-01-02 07:46:07",
          "endpoint": "/api/login",
          "level": "ERROR",
          "message": "Invalid operator PIN",
          "response_time": 0.48,
          "ip": "192.168.55.12"
        },
        {
          "timestamp": "2026-01-02 07:45:17",
          "endpoint": "/telemetry/ingest",
          "level": "ERROR",
          "message": "Sudden spike in latency",
          "response_time": 3.788,
          "ip": "10.21.7.8"
        },
        {
          "timestamp": "2026-01-02 07:45:10",
          "endpoint": "/api/login",
          "level": "CRITICAL",
          "message": "Invalid operator PIN",
          "response_time": 0.266,
          "ip": "172.20.5.20"
        },
        {
          "timestamp": "2026-01-02 07:45:08",
          "endpoint": "/api/login",
          "level": "ERROR",
          "message": "Service down",
          "response_time": 0.626,
          "ip": "192.168.55.12"
        },
        {
          "timestamp": "2026-01-02 07:45:05",
          "endpoint": "/telemetry/ingest",
          "level": "ERROR",
          "message": "Lost sync / Relay timeout",
          "response_time": 3.616,
          "ip": "10.21.7.8"
        },
        {
          "timestamp": "2026-01-02 07:44:44",
          "endpoint": "/api/search",
          "level": "ERROR",
          "message": "Sudden spike in latency",
          "response_time": 3.028,
          "ip": "10.21.3.4"
        },
        {
          "timestamp": "2026-01-02 07:44:16",
          "endpoint": "/sensor/upload",
          "level": "ERROR",
          "message": "Sudden spike in latency",
          "response_time": 3.659,
          "ip": "10.21.3.4"
        },
        {
          "timestamp": "2026-01-02 07:44:14",
          "endpoint": "/api/login",
          "level": "ERROR",
          "message": "Invalid operator PIN",
          "response_time": 0.274,
          "ip": "10.21.3.4"
        },
        {
          "timestamp": "2026-01-02 07:44:06",
          "endpoint": "/telemetry/ingest",
          "level": "ERROR",
          "message": "Lost sync / Relay timeout",
          "response_time": 2.602,
          "ip": "10.0.0.100"
        },
        {
          "timestamp": "2026-01-02 07:44:05",
          "endpoint": "/compute/node",
          "level": "ERROR",
          "message": "Sudden spike in latency",
          "response_time": 3.689,
          "ip": "172.16.9.20"
        },
        {
          "timestamp": "2026-01-02 07:44:04",
          "endpoint": "/api/login",
          "level": "ERROR",
          "message": "Service down",
          "response_time": 0.235,
          "ip": "10.30.0.12"
        },
        {
          "timestamp": "2026-01-02 07:43:51",
          "endpoint": "/telemetry/ingest",
          "level": "ERROR",
          "message": "Lost sync / Relay timeout",
          "response_time": 2.671,
          "ip": "10.21.7.8"
        },
        {
          "timestamp": "2026-01-02 07:43:41",
          "endpoint": "/telemetry/ingest",
          "level": "ERROR",
          "message": "Lost sync / Relay timeout",
          "response_time": 4.664,
          "ip": "10.21.3.4"
        },
        {
          "timestamp": "2026-01-02 07:43:37",
          "endpoint": "/api/search",
          "level": "ERROR",
          "message": "Sudden spike in latency",
          "response_time": 3.43,
          "ip": "192.168.55.12"
        },
        {
          "timestamp": "2026-01-02 07:43:25",
          "endpoint": "/api/search",
          "level": "ERROR",
          "message": "Sudden spike in latency",
          "response_time": 3.104,
          "ip": "192.168.1.10"
        },
        {
          "timestamp": "2026-01-02 07:43:14",
          "endpoint": "/relay/marslink",
          "level": "ERROR",
          "message": "Lost sync / Relay timeout",
          "response_time": 4.026,
          "ip": "10.21.3.4"
        },
        {
          "timestamp": "2026-01-02 07:43:14",
          "endpoint": "/api/login",
          "level": "ERROR",
          "message": "Invalid operator PIN",
          "response_time": 0.088,
          "ip": "10.0.0.100"
        },
        {
          "timestamp": "2026-01-02 07:43:11",
          "endpoint": "/telemetry/ingest",
          "level": "ERROR",
          "message": "Lost sync / Relay timeout",
          "response_time": 4.461,
          "ip": "172.16.9.20"
        },
        {
          "timestamp": "2026-01-02 07:43:05",
          "endpoint": "/telemetry/ingest",
          "level": "ERROR",
          "message": "Sudden spike in latency",
          "response_time": 3.092,
          "ip": "10.0.0.100"
        },
        {
          "timestamp": "2026-01-02 07:43:00",
          "endpoint": "/telemetry/ingest",
          "level": "ERROR",
          "message": "Lost sync / Relay timeout",
          "response_time": 2.646,
          "ip": "10.21.7.8"
        },
        {
          "timestamp": "2026-01-02 07:42:59",
          "endpoint": "/telemetry/ingest",
          "level": "ERROR",
          "message": "Lost sync / Relay timeout",
          "response_time": 1.879,
          "ip": "127.0.0.1"
        },
        {
          "timestamp": "2026-01-02 07:42:54",
          "endpoint": "/relay/marslink",
          "level": "ERROR",
          "message": "Lost sync / Relay timeout",
          "response_time": 3.724,
          "ip": "10.21.7.8"
        },
        {
          "timestamp": "2026-01-02 07:42:46",
          "endpoint": "/api/search",
          "level": "ERROR",
          "message": "Sudden spike in latency",
          "response_time": 3.417,
          "ip": "10.21.3.4"
        },
        {
          "timestamp": "2026-01-02 07:42:33",
          "endpoint": "/telemetry/ingest",
          "level": "ERROR",
          "message": "Lost sync / Relay timeout",
          "response_time": 3.369,
          "ip": "10.21.3.4"
        },
        {
          "timestamp": "2026-01-02 07:42:17",
          "endpoint": "/telemetry/ingest",
          "level": "ERROR",
          "message": "Lost sync / Relay timeout",
          "response_time": 2.675,
          "ip": "192.168.1.10"
        },
        {
          "timestamp": "2026-01-02 07:42:14",
          "endpoint": "/telemetry/ingest",
          "level": "ERROR",
          "message": "Lost sync / Relay timeout",
          "response_time": 2.826,
          "ip": "10.21.3.4"
        },
        {
          "timestamp": "2026-01-02 07:42:14",
          "endpoint": "/api/login",
          "level": "ERROR",
          "message": "Service down",
          "response_time": 0.297,
          "ip": "10.21.3.4"
        },
        {
          "timestamp": "2026-01-02 07:40:51",
          "endpoint": "/telemetry/ingest",
          "level": "ERROR",
          "message": "Lost sync / Relay timeout",
          "response_time": 1.555,
          "ip": "172.16.9.20"
        },
        {
          "timestamp": "2026-01-02 07:38:50",
          "endpoint": "/telemetry/ingest",
          "level": "ERROR",
          "message": "Lost sync / Relay timeout",
          "response_time": 1.654,
          "ip": "10.30.0.12"
        },
        {
          "timestamp": "2026-01-02 07:38:08",
          "endpoint": "/telemetry/ingest",
          "level": "ERROR",
          "message": "Lost sync / Relay timeout",
          "response_time": 2.754,
          "ip": "172.20.5.20"
        },
        {
          "timestamp": "2026-01-02 07:32:35",
          "endpoint": "/api/login",
          "level": "CRITICAL",
          "message": "Service down",
          "response_time": 0.198,
          "ip": "10.30.0.12"
        },
        {
          "timestamp": "2026-01-02 07:47:05",
          "endpoint": "/compute/node",
          "level": "INFO",
          "message": "GPU batch processed",
          "response_time": 0.106,
          "ip": "10.0.0.100"
        },
        {
          "timestamp": "2026-01-02 07:47:05",
          "endpoint": "/crew/status",
          "level": "INFO",
          "message": "Crew heartbeats OK",
          "response_time": 0.088,
          "ip": "10.21.3.4"
        },
        {
          "timestamp": "2026-01-02 07:47:05",
          "endpoint": "/api/search",
          "level": "INFO",
          "message": "Search OK",
          "response_time": 0.154,
          "ip": "192.168.55.12"
        },
        {
          "timestamp": "2026-01-02 07:47:04",
          "endpoint": "/compute/node",
          "level": "INFO",
          "message": "GPU batch processed",
          "response_time": 0.112,
          "ip": "10.21.7.8"
        },
        {
          "timestamp": "2026-01-02 07:47:04",
          "endpoint": "/compute/node",
          "level": "INFO",
          "message": "GPU batch processed",
          "response_time": 0.097,
          "ip": "192.168.55.12"
        },
        {
          "timestamp": "2026-01-02 07:47:04",
          "endpoint": "/sensor/upload",
          "level": "INFO",
          "message": "Gyro data packet received",
          "response_time": 0.036,
          "ip": "172.16.9.20"
        },
        {
          "timestamp": "2026-01-02 07:47:04",
          "endpoint": "/telemetry/ingest",
          "level": "INFO",
          "message": "Stream heartbeat OK",
          "response_time": 0.125,
          "ip": "172.31.8.90"
        },
        {
          "timestamp": "2026-01-02 07:47:04",
          "endpoint": "/crew/status",
          "level": "INFO",
          "message": "Crew heartbeats OK",
          "response_time": 0.167,
          "ip": "192.168.55.12"
        },
        {
          "timestamp": "2026-01-02 07:47:04",
          "endpoint": "/crew/status",
          "level": "INFO",
          "message": "Crew heartbeats OK",
          "response_time": 0.12,
          "ip": "172.20.5.20"
        },
        {
          "timestamp": "2026-01-02 07:47:03",
          "endpoint": "/telemetry/ingest",
          "level": "INFO",
          "message": "Stream heartbeat OK",
          "response_time": 0.139,
          "ip": "127.0.0.1"
        },
        {
          "timestamp": "2026-01-02 07:47:03",
          "endpoint": "/api/search",
          "level": "INFO",
          "message": "Search OK",
          "response_time": 0.147,
          "ip": "10.0.0.100"
        },
        {
          "timestamp": "2026-01-02 07:47:02",
          "endpoint": "/crew/status",
          "level": "INFO",
          "message": "Crew heartbeats OK",
          "response_time": 0.101,
          "ip": "10.21.3.4"
        },
        {
          "timestamp": "2026-01-02 07:47:02",
          "endpoint": "/crew/status",
          "level": "INFO",
          "message": "Crew heartbeats OK",
          "response_time": 0.111,
          "ip": "172.16.9.20"
        },
        {
          "timestamp": "2026-01-02 07:47:02",
          "endpoint": "/api/search",
          "level": "INFO",
          "message": "Search OK",
          "response_time": 0.152,
          "ip": "172.31.8.90"
        },
        {
          "timestamp": "2026-01-02 07:47:02",
          "endpoint": "/proc/fuel",
          "level": "INFO",
          "message": "Fuel telemetry OK",
          "response_time": 0.119,
          "ip": "10.0.0.100"
        },
        {
          "timestamp": "2026-01-02 07:47:02",
          "endpoint": "/compute/node",
          "level": "INFO",
          "message": "GPU batch processed",
          "response_time": 0.051,
          "ip": "10.30.0.12"
        },
        {
          "timestamp": "2026-01-02 07:47:01",
          "endpoint": "/api/login",
          "level": "INFO",
          "message": "Login OK",
          "response_time": 0.004,
          "ip": "127.0.0.1"
        },
        {
          "timestamp": "2026-01-02 07:47:01",
          "endpoint": "/telemetry/ingest",
          "level": "INFO",
          "message": "Stream heartbeat OK",
          "response_time": 0.213,
          "ip": "10.0.0.100"
        },
        {
          "timestamp": "2026-01-02 07:47:01",
          "endpoint": "/telemetry/ingest",
          "level": "INFO",
          "message": "Stream heartbeat OK",
          "response_time": 0.174,
          "ip": "192.168.55.12"
        },
        {
          "timestamp": "2026-01-02 07:47:01",
          "endpoint": "/api/search",
          "level": "INFO",
          "message": "Search OK",
          "response_time": 0.116,
          "ip": "10.21.3.4"
        },
        {
          "timestamp": "2026-01-02 07:47:00",
          "endpoint": "/ops/delete-task",
          "level": "INFO",
          "message": "Task purge requested",
          "response_time": 0.07,
          "ip": "192.168.55.12"
        },
        {
          "timestamp": "2026-01-02 07:47:00",
          "endpoint": "/telemetry/ingest",
          "level": "WARN",
          "message": "Sudden spike in latency",
          "response_time": 1.677,
          "ip": "10.21.7.8"
        },
        {
          "timestamp": "2026-01-02 07:47:00",
          "endpoint": "/api/login",
          "level": "INFO",
          "message": "Login OK",
          "response_time": 0.028,
          "ip": "10.21.7.8"
        },
        {
          "timestamp": "2026-01-02 07:47:00",
          "endpoint": "/proc/fuel",
          "level": "INFO",
          "message": "Fuel telemetry OK",
          "response_time": 0.035,
          "ip": "172.20.5.20"
        },
        {
          "timestamp": "2026-01-02 07:47:00",
          "endpoint": "/proc/fuel",
          "level": "INFO",
          "message": "Fuel telemetry OK",
          "response_time": 0.154,
          "ip": "10.30.0.12"
        },
        {
          "timestamp": "2026-01-02 07:46:59",
          "endpoint": "/telemetry/ingest",
          "level": "INFO",
          "message": "Stream heartbeat OK",
          "response_time": 0.03,
          "ip": "172.16.9.20"
        },
        {
          "timestamp": "2026-01-02 07:46:59",
          "endpoint": "/compute/node",
          "level": "INFO",
          "message": "GPU batch processed",
          "response_time": 0.063,
          "ip": "172.31.8.90"
        },
        {
          "timestamp": "2026-01-02 07:46:59",
          "endpoint": "/api/search",
          "level": "INFO",
          "message": "Search OK",
          "response_time": 0.206,
          "ip": "10.21.3.4"
        },
        {
          "timestamp": "2026-01-02 07:46:59",
          "endpoint": "/telemetry/ingest",
          "level": "INFO",
          "message": "Stream heartbeat OK",
          "response_time": 0.197,
          "ip": "172.16.9.20"
        },
        {
          "timestamp": "2026-01-02 07:46:59",
          "endpoint": "/sensor/upload",
          "level": "INFO",
          "message": "Gyro data packet received",
          "response_time": 0.127,
          "ip": "172.16.9.20"
        },
        {
          "timestamp": "2026-01-02 07:46:58",
          "endpoint": "/ops/delete-task",
          "level": "INFO",
          "message": "Task purge requested",
          "response_time": 0.111,
          "ip": "127.0.0.1"
        },
        {
          "timestamp": "2026-01-02 07:46:58",
          "endpoint": "/ops/delete-task",
          "level": "INFO",
          "message": "Task purge requested",
          "response_time": 0.067,
          "ip": "192.168.55.12"
        },
        {
          "timestamp": "2026-01-02 07:46:58",
          "endpoint": "/sensor/upload",
          "level": "INFO",
          "message": "Gyro data packet received",
          "response_time": 0.143,
          "ip": "192.168.55.12"
        },
        {
          "timestamp": "2026-01-02 07:46:58",
          "endpoint": "/telemetry/ingest",
          "level": "INFO",
          "message": "Stream heartbeat OK",
          "response_time": 0.195,
          "ip": "10.0.0.100"
        },
        {
          "timestamp": "2026-01-02 07:46:58",
          "endpoint": "/api/search",
          "level": "INFO",
          "message": "Search OK",
          "response_time": 0.013,
          "ip": "10.0.0.100"
        },
        {
          "timestamp": "2026-01-02 07:46:58",
          "endpoint": "/telemetry/ingest",
          "level": "INFO",
          "message": "Stream heartbeat OK",
          "response_time": 0.119,
          "ip": "172.20.5.20"
        },
        {
          "timestamp": "2026-01-02 07:46:57",
          "endpoint": "/crew/status",
          "level": "INFO",
          "message": "Crew heartbeats OK",
          "response_time": 0.116,
          "ip": "127.0.0.1"
        },
        {
          "timestamp": "2026-01-02 07:46:57",
          "endpoint": "/relay/marslink",
          "level": "INFO",
          "message": "Relay ok",
          "response_time": 0.227,
          "ip": "192.168.1.10"
        },
        {
          "timestamp": "2026-01-02 07:46:57",
          "endpoint": "/telemetry/ingest",
          "level": "INFO",
          "message": "Stream heartbeat OK",
          "response_time": 0.043,
          "ip": "127.0.0.1"
        },
        {
          "timestamp": "2026-01-02 07:46:57",
          "endpoint": "/telemetry/ingest",
          "level": "INFO",
          "message": "Stream heartbeat OK",
          "response_time": 0.109,
          "ip": "10.30.0.12"
        },
        {
          "timestamp": "2026-01-02 07:46:56",
          "endpoint": "/ops/delete-task",
          "level": "INFO",
          "message": "Task purge requested",
          "response_time": 0.083,
          "ip": "192.168.1.10"
        },
        {
          "timestamp": "2026-01-02 07:46:56",
          "endpoint": "/ops/delete-task",
          "level": "INFO",
          "message": "Task purge requested",
          "response_time": 0.218,
          "ip": "10.0.0.100"
        },
        {
          "timestamp": "2026-01-02 07:46:55",
          "endpoint": "/sensor/upload",
          "level": "INFO",
          "message": "Gyro data packet received",
          "response_time": 0.231,
          "ip": "127.0.0.1"
        },
        {
          "timestamp": "2026-01-02 07:46:55",
          "endpoint": "/telemetry/ingest",
          "level": "INFO",
          "message": "Stream heartbeat OK",
          "response_time": 0.054,
          "ip": "127.0.0.1"
        },
        {
          "timestamp": "2026-01-02 07:46:55",
          "endpoint": "/telemetry/ingest",
          "level": "INFO",
          "message": "Stream heartbeat OK",
          "response_time": 0.035,
          "ip": "10.21.3.4"
        },
        {
          "timestamp": "2026-01-02 07:46:55",
          "endpoint": "/ops/delete-task",
          "level": "INFO",
          "message": "Task purge requested",
          "response_time": 0.081,
          "ip": "10.0.0.100"
        },
        {
          "timestamp": "2026-01-02 07:46:54",
          "endpoint": "/api/login",
          "level": "INFO",
          "message": "Login OK",
          "response_time": 0.269,
          "ip": "10.21.7.8"
        },
        {
          "timestamp": "2026-01-02 07:46:54",
          "endpoint": "/telemetry/ingest",
          "level": "INFO",
          "message": "Stream heartbeat OK",
          "response_time": 0.116,
          "ip": "10.0.0.100"
        },
        {
          "timestamp": "2026-01-02 07:46:54",
          "endpoint": "/telemetry/ingest",
          "level": "INFO",
          "message": "Stream heartbeat OK",
          "response_time": 0.076,
          "ip": "192.168.1.10"
        },
        {
          "timestamp": "2026-01-02 07:46:53",
          "endpoint": "/api/search",
          "level": "INFO",
          "message": "Search OK",
          "response_time": 0.174,
          "ip": "10.21.3.4"
        },
        {
          "timestamp": "2026-01-02 07:46:53",
          "endpoint": "/relay/marslink",
          "level": "INFO",
          "message": "Relay ok",
          "response_time": 0.296,
          "ip": "192.168.55.12"
        },
        {
          "timestamp": "2026-01-02 07:46:52",
          "endpoint": "/sensor/upload",
          "level": "INFO",
          "message": "Gyro data packet received",
          "response_time": 0.194,
          "ip": "10.21.3.4"
        },
        {
          "timestamp": "2026-01-02 07:46:52",
          "endpoint": "/api/login",
          "level": "INFO",
          "message": "Login OK",
          "response_time": 0.274,
          "ip": "127.0.0.1"
        },
        {
          "timestamp": "2026-01-02 07:46:51",
          "endpoint": "/sensor/upload",
          "level": "INFO",
          "message": "Gyro data packet received",
          "response_time": 0.059,
          "ip": "172.16.9.20"
        },
        {
          "timestamp": "2026-01-02 07:46:50",
          "endpoint": "/api/search",
          "level": "INFO",
          "message": "Search OK",
          "response_time": 0.077,
          "ip": "192.168.55.12"
        },
        {
          "timestamp": "2026-01-02 07:46:50",
          "endpoint": "/proc/fuel",
          "level": "INFO",
          "message": "Fuel telemetry OK",
          "response_time": 0.062,
          "ip": "10.0.0.100"
        },
        {
          "timestamp": "2026-01-02 07:46:50",
          "endpoint": "/api/login",
          "level": "INFO",
          "message": "Login OK",
          "response_time": 0.117,
          "ip": "172.16.9.20"
        },
        {
          "timestamp": "2026-01-02 07:46:50",
          "endpoint": "/api/login",
          "level": "INFO",
          "message": "Login OK",
          "response_time": 0.014,
          "ip": "10.0.0.100"
        },
        {
          "timestamp": "2026-01-02 07:46:50",
          "endpoint": "/crew/status",
          "level": "INFO",
          "message": "Crew heartbeats OK",
          "response_time": 0.056,
          "ip": "10.21.7.8"
        },
        {
          "timestamp": "2026-01-02 07:46:50",
          "endpoint": "/api/login",
          "level": "INFO",
          "message": "Login OK",
          "response_time": 0.208,
          "ip": "10.21.3.4"
        },
        {
          "timestamp": "2026-01-02 07:46:49",
          "endpoint": "/compute/node",
          "level": "INFO",
          "message": "GPU batch processed",
          "response_time": 0.183,
          "ip": "172.31.8.90"
        },
        {
          "timestamp": "2026-01-02 07:46:48",
          "endpoint": "/api/search",
          "level": "INFO",
          "message": "Search OK",
          "response_time": 0.178,
          "ip": "172.31.8.90"
        },
        {
          "timestamp": "2026-01-02 07:46:48",
          "endpoint": "/sensor/upload",
          "level": "INFO",
          "message": "Gyro data packet received",
          "response_time": 0.105,
          "ip": "127.0.0.1"
        },
        {
          "timestamp": "2026-01-02 07:46:48",
          "endpoint": "/telemetry/ingest",
          "level": "INFO",
          "message": "Stream heartbeat OK",
          "response_time": 0.199,
          "ip": "127.0.0.1"
        },
        {
          "timestamp": "2026-01-02 07:46:48",
          "endpoint": "/ops/delete-task",
          "level": "INFO",
          "message": "Task purge requested",
          "response_time": 0.167,
          "ip": "192.168.1.10"
        },
        {
          "timestamp": "2026-01-02 07:46:48",
          "endpoint": "/api/login",
          "level": "INFO",
          "message": "Login OK",
          "response_time": 0.194,
          "ip": "172.16.9.20"
        },
        {
          "timestamp": "2026-01-02 07:46:47",
          "endpoint": "/telemetry/ingest",
          "level": "INFO",
          "message": "Stream heartbeat OK",
          "response_time": 0.1,
          "ip": "172.16.9.20"
        },
        {
          "timestamp": "2026-01-02 07:46:47",
          "endpoint": "/api/login",
          "level": "INFO",
          "message": "Login OK",
          "response_time": 0.021,
          "ip": "10.21.3.4"
        },
        {
          "timestamp": "2026-01-02 07:46:47",
          "endpoint": "/api/search",
          "level": "INFO",
          "message": "Search OK",
          "response_time": 0.215,
          "ip": "172.16.9.20"
        },
        {
          "timestamp": "2026-01-02 07:46:47",
          "endpoint": "/telemetry/ingest",
          "level": "INFO",
          "message": "Stream heartbeat OK",
          "response_time": 0.001,
          "ip": "172.31.8.90"
        },
        {
          "timestamp": "2026-01-02 07:46:47",
          "endpoint": "/proc/fuel",
          "level": "INFO",
          "message": "Fuel telemetry OK",
          "response_time": 0.064,
          "ip": "192.168.1.10"
        },
        {
          "timestamp": "2026-01-02 07:46:46",
          "endpoint": "/telemetry/ingest",
          "level": "INFO",
          "message": "Stream heartbeat OK",
          "response_time": 0.172,
          "ip": "172.16.9.20"
        },
        {
          "timestamp": "2026-01-02 07:46:46",
          "endpoint": "/api/login",
          "level": "INFO",
          "message": "Login OK",
          "response_time": 0.214,
          "ip": "172.31.8.90"
        },
        {
          "timestamp": "2026-01-02 07:46:46",
          "endpoint": "/telemetry/ingest",
          "level": "INFO",
          "message": "Stream heartbeat OK",
          "response_time": 0.074,
          "ip": "10.30.0.12"
        },
        {
          "timestamp": "2026-01-02 07:46:46",
          "endpoint": "/api/login",
          "level": "INFO",
          "message": "Login OK",
          "response_time": 0.176,
          "ip": "10.0.0.100"
        },
        {
          "timestamp": "2026-01-02 07:46:46",
          "endpoint": "/ops/diagnostics",
          "level": "INFO",
          "message": "System diagnostics triggered",
          "response_time": 0.202,
          "ip": "10.21.7.8"
        },
        {
          "timestamp": "2026-01-02 07:46:45",
          "endpoint": "/sensor/upload",
          "level": "INFO",
          "message": "Gyro data packet received",
          "response_time": 0.081,
          "ip": "10.21.7.8"
        },
        {
          "timestamp": "2026-01-02 07:46:45",
          "endpoint": "/telemetry/ingest",
          "level": "WARN",
          "message": "Sudden spike in latency",
          "response_time": 2.844,
          "ip": "10.21.3.4"
        },
        {
          "timestamp": "2026-01-02 07:46:45",
          "endpoint": "/api/login",
          "level": "INFO",
          "message": "Login OK",
          "response_time": 0.048,
          "ip": "172.20.5.20"
        },
        {
          "timestamp": "2026-01-02 07:46:45",
          "endpoint": "/telemetry/ingest",
          "level": "INFO",
          "message": "Stream heartbeat OK",
          "response_time": 0.108,
          "ip": "192.168.1.10"
        },
        {
          "timestamp": "2026-01-02 07:46:45",
          "endpoint": "/api/search",
          "level": "INFO",
          "message": "Search OK",
          "response_time": 0.122,
          "ip": "10.0.0.100"
        },
        {
          "timestamp": "2026-01-02 07:46:45",
          "endpoint": "/crew/status",
          "level": "INFO",
          "message": "Crew heartbeats OK",
          "response_time": 0.094,
          "ip": "172.31.8.90"
        },
        {
          "timestamp": "2026-01-02 07:46:45",
          "endpoint": "/compute/node",
          "level": "INFO",
          "message": "GPU batch processed",
          "response_time": 0.008,
          "ip": "10.0.0.100"
        },
        {
          "timestamp": "2026-01-02 07:46:44",
          "endpoint": "/telemetry/ingest",
          "level": "INFO",
          "message": "Stream heartbeat OK",
          "response_time": 0.202,
          "ip": "10.21.3.4"
        },
        {
          "timestamp": "2026-01-02 07:46:43",
          "endpoint": "/api/search",
          "level": "INFO",
          "message": "Search OK",
          "response_time": 0.127,
          "ip": "10.0.0.100"
        },
        {
          "timestamp": "2026-01-02 07:46:42",
          "endpoint": "/api/login",
          "level": "INFO",
          "message": "Login OK",
          "response_time": 0.229,
          "ip": "172.16.9.20"
        },
        {
          "timestamp": "2026-01-02 07:46:42",
          "endpoint": "/api/login",
          "level": "INFO",
          "message": "Login OK",
          "response_time": 0.159,
          "ip": "10.30.0.12"
        },
        {
          "timestamp": "2026-01-02 07:46:42",
          "endpoint": "/telemetry/ingest",
          "level": "INFO",
          "message": "Stream heartbeat OK",
          "response_time": 0.035,
          "ip": "172.16.9.20"
        },
        {
          "timestamp": "2026-01-02 07:46:42",
          "endpoint": "/api/search",
          "level": "INFO",
          "message": "Search OK",
          "response_time": 0.2,
          "ip": "192.168.1.10"
        },
        {
          "timestamp": "2026-01-02 07:46:41",
          "endpoint": "/api/search",
          "level": "INFO",
          "message": "Search OK",
          "response_time": 0.032,
          "ip": "172.20.5.20"
        },
        {
          "timestamp": "2026-01-02 07:46:41",
          "endpoint": "/api/search",
          "level": "INFO",
          "message": "Search OK",
          "response_time": 0.018,
          "ip": "172.20.5.20"
        },
        {
          "timestamp": "2026-01-02 07:46:41",
          "endpoint": "/api/login",
          "level": "INFO",
          "message": "Login OK",
          "response_time": 0.002,
          "ip": "172.16.9.20"
        },
        {
          "timestamp": "2026-01-02 07:46:40",
          "endpoint": "/telemetry/ingest",
          "level": "INFO",
          "message": "Stream heartbeat OK",
          "response_time": 0.165,
          "ip": "172.16.9.20"
        },
        {
          "timestamp": "2026-01-02 07:46:40",
          "endpoint": "/proc/fuel",
          "level": "INFO",
          "message": "Fuel telemetry OK",
          "response_time": 0.001,
          "ip": "10.0.0.100"
        },
        {
          "timestamp": "2026-01-02 07:46:40",
          "endpoint": "/telemetry/ingest",
          "level": "INFO",
          "message": "Stream heartbeat OK",
          "response_time": 0.228,
          "ip": "192.168.55.12"
        },
        {
          "timestamp": "2026-01-02 07:46:40",
          "endpoint": "/api/search",
          "level": "INFO",
          "message": "Search OK",
          "response_time": 0.135,
          "ip": "10.30.0.12"
        },
        {
          "timestamp": "2026-01-02 07:46:39",
          "endpoint": "/api/search",
          "level": "INFO",
          "message": "Search OK",
          "response_time": 0.19,
          "ip": "127.0.0.1"
        },
        {
          "timestamp": "2026-01-02 07:46:39",
          "endpoint": "/api/search",
          "level": "INFO",
          "message": "Search OK",
          "response_time": 0.173,
          "ip": "172.20.5.20"
        },
        {
          "timestamp": "2026-01-02 07:46:38",
          "endpoint": "/api/login",
          "level": "INFO",
          "message": "Login OK",
          "response_time": 0.146,
          "ip": "192.168.55.12"
        },
        {
          "timestamp": "2026-01-02 07:46:38",
          "endpoint": "/ops/delete-task",
          "level": "INFO",
          "message": "Task purge requested",
          "response_time": 0.126,
          "ip": "127.0.0.1"
        },
        {
          "timestamp": "2026-01-02 07:46:38",
          "endpoint": "/api/search",
          "level": "INFO",
          "message": "Search OK",
          "response_time": 0.144,
          "ip": "172.16.9.20"
        },
        {
          "timestamp": "2026-01-02 07:46:38",
          "endpoint": "/telemetry/ingest",
          "level": "INFO",
          "message": "Stream heartbeat OK",
          "response_time": 0.026,
          "ip": "172.20.5.20"
        },
        {
          "timestamp": "2026-01-02 07:46:38",
          "endpoint": "/crew/status",
          "level": "INFO",
          "message": "Crew heartbeats OK",
          "response_time": 0.104,
          "ip": "10.30.0.12"
        },
        {
          "timestamp": "2026-01-02 07:46:36",
          "endpoint": "/api/login",
          "level": "INFO",
          "message": "Login OK",
          "response_time": 0.053,
          "ip": "10.21.7.8"
        },
        {
          "timestamp": "2026-01-02 07:46:36",
          "endpoint": "/ops/delete-task",
          "level": "INFO",
          "message": "Task purge requested",
          "response_time": 0.186,
          "ip": "10.30.0.12"
        },
        {
          "timestamp": "2026-01-02 07:46:36",
          "endpoint": "/api/search",
          "level": "INFO",
          "message": "Search OK",
          "response_time": 0.09,
          "ip": "192.168.1.10"
        },
        {
          "timestamp": "2026-01-02 07:46:36",
          "endpoint": "/telemetry/ingest",
          "level": "INFO",
          "message": "Stream heartbeat OK",
          "response_time": 0.297,
          "ip": "192.168.55.12"
        },
        {
          "timestamp": "2026-01-02 07:46:36",
          "endpoint": "/api/login",
          "level": "INFO",
          "message": "Login OK",
          "response_time": 0.044,
          "ip": "127.0.0.1"
        },
        {
          "timestamp": "2026-01-02 07:46:35",
          "endpoint": "/proc/fuel",
          "level": "INFO",
          "message": "Fuel telemetry OK",
          "response_time": 0.08,
          "ip": "192.168.55.12"
        },
        {
          "timestamp": "2026-01-02 07:46:34",
          "endpoint": "/telemetry/ingest",
          "level": "INFO",
          "message": "Stream heartbeat OK",
          "response_time": 0.08,
          "ip": "10.21.3.4"
        },
        {
          "timestamp": "2026-01-02 07:46:34",
          "endpoint": "/sensor/upload",
          "level": "INFO",
          "message": "Gyro data packet received",
          "response_time": 0.071,
          "ip": "192.168.1.10"
        },
        {
          "timestamp": "2026-01-02 07:46:33",
          "endpoint": "/api/search",
          "level": "INFO",
          "message": "Search OK",
          "response_time": 0.069,
          "ip": "10.30.0.12"
        },
        {
          "timestamp": "2026-01-02 07:46:32",
          "endpoint": "/api/search",
          "level": "INFO",
          "message": "Search OK",
          "response_time": 0.125,
          "ip": "10.21.3.4"
        },
        {
          "timestamp": "2026-01-02 07:46:32",
          "endpoint": "/api/search",
          "level": "INFO",
          "message": "Search OK",
          "response_time": 0.041,
          "ip": "127.0.0.1"
        },
        {
          "timestamp": "2026-01-02 07:46:32",
          "endpoint": "/crew/status",
          "level": "INFO",
          "message": "Crew heartbeats OK",
          "response_time": 0.055,
          "ip": "10.0.0.100"
        },
        {
          "timestamp": "2026-01-02 07:46:32",
          "endpoint": "/relay/marslink",
          "level": "INFO",
          "message": "Relay ok",
          "response_time": 0.109,
          "ip": "172.31.8.90"
        },
        {
          "timestamp": "2026-01-02 07:46:32",
          "endpoint": "/proc/fuel",
          "level": "INFO",
          "message": "Fuel telemetry OK",
          "response_time": 0.057,
          "ip": "10.21.7.8"
        },
        {
          "timestamp": "2026-01-02 07:46:32",
          "endpoint": "/telemetry/ingest",
          "level": "INFO",
          "message": "Stream heartbeat OK",
          "response_time": 0.144,
          "ip": "10.0.0.100"
        },
        {
          "timestamp": "2026-01-02 07:46:31",
          "endpoint": "/api/search",
          "level": "INFO",
          "message": "Search OK",
          "response_time": 0.064,
          "ip": "192.168.1.10"
        },
        {
          "timestamp": "2026-01-02 07:46:31",
          "endpoint": "/api/login",
          "level": "INFO",
          "message": "Login OK",
          "response_time": 0.027,
          "ip": "10.21.7.8"
        },
        {
          "timestamp": "2026-01-02 07:46:31",
          "endpoint": "/api/login",
          "level": "INFO",
          "message": "Login OK",
          "response_time": 0.143,
          "ip": "172.20.5.20"
        },
        {
          "timestamp": "2026-01-02 07:46:31",
          "endpoint": "/proc/fuel",
          "level": "INFO",
          "message": "Fuel telemetry OK",
          "response_time": 0.174,
          "ip": "172.31.8.90"
        },
        {
          "timestamp": "2026-01-02 07:46:31",
          "endpoint": "/crew/status",
          "level": "INFO",
          "message": "Crew heartbeats OK",
          "response_time": 0.209,
          "ip": "172.16.9.20"
        },
        {
          "timestamp": "2026-01-02 07:46:31",
          "endpoint": "/telemetry/ingest",
          "level": "INFO",
          "message": "Stream heartbeat OK",
          "response_time": 0.121,
          "ip": "172.31.8.90"
        },
        {
          "timestamp": "2026-01-02 07:46:31",
          "endpoint": "/ops/diagnostics",
          "level": "INFO",
          "message": "System diagnostics triggered",
          "response_time": 0.095,
          "ip": "10.30.0.12"
        },
        {
          "timestamp": "2026-01-02 07:46:31",
          "endpoint": "/telemetry/ingest",
          "level": "INFO",
          "message": "Stream heartbeat OK",
          "response_time": 0.168,
          "ip": "127.0.0.1"
        },
        {
          "timestamp": "2026-01-02 07:46:30",
          "endpoint": "/api/search",
          "level": "INFO",
          "message": "Search OK",
          "response_time": 0.105,
          "ip": "192.168.55.12"
        },
        {
          "timestamp": "2026-01-02 07:46:30",
          "endpoint": "/api/search",
          "level": "WARN",
          "message": "Sudden spike in latency",
          "response_time": 2.598,
          "ip": "172.31.8.90"
        },
        {
          "timestamp": "2026-01-02 07:46:30",
          "endpoint": "/api/login",
          "level": "INFO",
          "message": "Login OK",
          "response_time": 0.124,
          "ip": "10.21.7.8"
        },
        {
          "timestamp": "2026-01-02 07:46:30",
          "endpoint": "/telemetry/ingest",
          "level": "INFO",
          "message": "Stream heartbeat OK",
          "response_time": 0.079,
          "ip": "127.0.0.1"
        },
        {
          "timestamp": "2026-01-02 07:46:30",
          "endpoint": "/api/search",
          "level": "INFO",
          "message": "Search OK",
          "response_time": 0.092,
          "ip": "10.21.7.8"
        },
        {
          "timestamp": "2026-01-02 07:46:30",
          "endpoint": "/relay/marslink",
          "level": "INFO",
          "message": "Relay ok",
          "response_time": 0.113,
          "ip": "10.21.7.8"
        },
        {
          "timestamp": "2026-01-02 07:46:30",
          "endpoint": "/api/login",
          "level": "INFO",
          "message": "Login OK",
          "response_time": 0.102,
          "ip": "10.30.0.12"
        },
        {
          "timestamp": "2026-01-02 07:46:29",
          "endpoint": "/sensor/upload",
          "level": "INFO",
          "message": "Gyro data packet received",
          "response_time": 0.264,
          "ip": "192.168.55.12"
        },
        {
          "timestamp": "2026-01-02 07:46:29",
          "endpoint": "/telemetry/ingest",
          "level": "INFO",
          "message": "Stream heartbeat OK",
          "response_time": 0.081,
          "ip": "10.21.3.4"
        },
        {
          "timestamp": "2026-01-02 07:46:29",
          "endpoint": "/sensor/upload",
          "level": "WARN",
          "message": "Sudden spike in latency",
          "response_time": 2.126,
          "ip": "172.31.8.90"
        },
        {
          "timestamp": "2026-01-02 07:46:29",
          "endpoint": "/api/login",
          "level": "INFO",
          "message": "Login OK",
          "response_time": 0.096,
          "ip": "192.168.1.10"
        },
        {
          "timestamp": "2026-01-02 07:46:28",
          "endpoint": "/api/search",
          "level": "INFO",
          "message": "Search OK",
          "response_time": 0.06,
          "ip": "10.21.7.8"
        },
        {
          "timestamp": "2026-01-02 07:46:28",
          "endpoint": "/proc/fuel",
          "level": "INFO",
          "message": "Fuel telemetry OK",
          "response_time": 0.058,
          "ip": "10.21.3.4"
        },
        {
          "timestamp": "2026-01-02 07:46:28",
          "endpoint": "/api/search",
          "level": "INFO",
          "message": "Search OK",
          "response_time": 0.136,
          "ip": "172.20.5.20"
        },
        {
          "timestamp": "2026-01-02 07:46:28",
          "endpoint": "/telemetry/ingest",
          "level": "INFO",
          "message": "Stream heartbeat OK",
          "response_time": 0.121,
          "ip": "10.0.0.100"
        },
        {
          "timestamp": "2026-01-02 07:46:28",
          "endpoint": "/telemetry/ingest",
          "level": "WARN",
          "message": "Sudden spike in latency",
          "response_time": 2.767,
          "ip": "172.31.8.90"
        },
        {
          "timestamp": "2026-01-02 07:46:27",
          "endpoint": "/telemetry/ingest",
          "level": "INFO",
          "message": "Stream heartbeat OK",
          "response_time": 0.224,
          "ip": "10.21.3.4"
        },
        {
          "timestamp": "2026-01-02 07:46:27",
          "endpoint": "/compute/node",
          "level": "INFO",
          "message": "GPU batch processed",
          "response_time": 0.136,
          "ip": "192.168.55.12"
        },
        {
          "timestamp": "2026-01-02 07:46:27",
          "endpoint": "/proc/fuel",
          "level": "INFO",
          "message": "Fuel telemetry OK",
          "response_time": 0.096,
          "ip": "10.21.7.8"
        },
        {
          "timestamp": "2026-01-02 07:46:27",
          "endpoint": "/api/search",
          "level": "INFO",
          "message": "Search OK",
          "response_time": 0.14,
          "ip": "10.0.0.100"
        },
        {
          "timestamp": "2026-01-02 07:46:27",
          "endpoint": "/telemetry/ingest",
          "level": "INFO",
          "message": "Stream heartbeat OK",
          "response_time": 0.029,
          "ip": "10.21.3.4"
        },
        {
          "timestamp": "2026-01-02 07:46:26",
          "endpoint": "/compute/node",
          "level": "INFO",
          "message": "GPU batch processed",
          "response_time": 0.171,
          "ip": "172.31.8.90"
        },
        {
          "timestamp": "2026-01-02 07:46:26",
          "endpoint": "/proc/fuel",
          "level": "INFO",
          "message": "Fuel telemetry OK",
          "response_time": 0.108,
          "ip": "172.16.9.20"
        },
        {
          "timestamp": "2026-01-02 07:46:26",
          "endpoint": "/telemetry/ingest",
          "level": "INFO",
          "message": "Stream heartbeat OK",
          "response_time": 0.157,
          "ip": "10.21.3.4"
        },
        {
          "timestamp": "2026-01-02 07:46:26",
          "endpoint": "/telemetry/ingest",
          "level": "INFO",
          "message": "Stream heartbeat OK",
          "response_time": 0.226,
          "ip": "172.31.8.90"
        },
        {
          "timestamp": "2026-01-02 07:46:26",
          "endpoint": "/sensor/upload",
          "level": "INFO",
          "message": "Gyro data packet received",
          "response_time": 0.105,
          "ip": "192.168.55.12"
        },
        {
          "timestamp": "2026-01-02 07:46:25",
          "endpoint": "/proc/fuel",
          "level": "WARN",
          "message": "Sudden spike in latency",
          "response_time": 2.556,
          "ip": "10.21.3.4"
        },
        {
          "timestamp": "2026-01-02 07:46:25",
          "endpoint": "/api/login",
          "level": "INFO",
          "message": "Login OK",
          "response_time": 0.013,
          "ip": "172.20.5.20"
        },
        {
          "timestamp": "2026-01-02 07:46:25",
          "endpoint": "/sensor/upload",
          "level": "INFO",
          "message": "Gyro data packet received",
          "response_time": 0.182,
          "ip": "192.168.1.10"
        },
        {
          "timestamp": "2026-01-02 07:46:25",
          "endpoint": "/telemetry/ingest",
          "level": "INFO",
          "message": "Stream heartbeat OK",
          "response_time": 0.128,
          "ip": "172.20.5.20"
        }
      ],
      "top_anomalies": [
        {
          "timestamp": "2026-01-02 05:08:51.105522",
          "type": "error_spike",
          "severity": "medium",
          "message": "Service down",
          "score": 0.4775
        },
        {
          "timestamp": "2026-01-02 05:08:51.105139",
          "type": "unusual_pattern",
          "severity": "medium",
          "message": "Sudden spike in latency",
          "score": 0.4297
        },
        {
          "timestamp": "2026-01-02 05:08:51.106100",
          "type": "error_spike",
          "severity": "low",
          "message": "Invalid operator PIN",
          "score": 0.262
        },
        {
          "timestamp": "2026-01-01 20:25:14.267431",
          "type": "unusual_pattern",
          "severity": "low",
          "message": "Gyro data packet received",
          "score": 0.2731
        },
        {
          "timestamp": "2026-01-02 05:08:51.106307",
          "type": "latency_spike",
          "severity": "critical",
          "message": "Sudden spike in latency",
          "score": 3.449
        },
        {
          "timestamp": "2026-01-02 05:08:51.106265",
          "type": "latency_spike",
          "severity": "critical",
          "message": "Sudden spike in latency",
          "score": 3.1538
        },
        {
          "timestamp": "2026-01-02 05:08:51.106240",
          "type": "latency_spike",
          "severity": "critical",
          "message": "Sudden spike in latency",
          "score": 3.2126
        },
        {
          "timestamp": "2026-01-02 05:08:51.106183",
          "type": "latency_spike",
          "severity": "critical",
          "message": "Lost sync / Relay timeout",
          "score": 3.3147
        },
        {
          "timestamp": "2026-01-02 05:08:51.106156",
          "type": "latency_spike",
          "severity": "critical",
          "message": "Sudden spike in latency",
          "score": 3.5763
        },
        {
          "timestamp": "2026-01-02 05:08:51.106128",
          "type": "latency_spike",
          "severity": "critical",
          "message": "Sudden spike in latency",
          "score": 3.898
        },
        {
          "timestamp": "2026-01-02 05:08:51.106065",
          "type": "latency_spike",
          "severity": "critical",
          "message": "Lost sync / Relay timeout",
          "score": 4.361
        },
        {
          "timestamp": "2026-01-02 05:08:51.106024",
          "type": "latency_spike",
          "severity": "critical",
          "message": "Sudden spike in latency",
          "score": 5.0726
        },
        {
          "timestamp": "2026-01-02 05:08:51.106000",
          "type": "latency_spike",
          "severity": "critical",
          "message": "Sudden spike in latency",
          "score": 5.2783
        },
        {
          "timestamp": "2026-01-02 05:08:51.105966",
          "type": "latency_spike",
          "severity": "critical",
          "message": "Sudden spike in latency",
          "score": 4.453
        },
        {
          "timestamp": "2026-01-02 05:08:51.105891",
          "type": "latency_spike",
          "severity": "critical",
          "message": "Sudden spike in latency",
          "score": 1.9543
        },
        {
          "timestamp": "2026-01-02 05:08:51.105866",
          "type": "latency_spike",
          "severity": "critical",
          "message": "Lost sync / Relay timeout",
          "score": 6.6825
        },
        {
          "timestamp": "2026-01-02 05:08:51.105826",
          "type": "latency_spike",
          "severity": "critical",
          "message": "Sudden spike in latency",
          "score": 3.5567
        },
        {
          "timestamp": "2026-01-02 05:08:51.105799",
          "type": "latency_spike",
          "severity": "critical",
          "message": "Sudden spike in latency",
          "score": 4.6851
        },
        {
          "timestamp": "2026-01-02 05:08:51.105778",
          "type": "latency_spike",
          "severity": "critical",
          "message": "Lost sync / Relay timeout",
          "score": 7.5562
        },
        {
          "timestamp": "2026-01-02 05:08:51.105751",
          "type": "latency_spike",
          "severity": "critical",
          "message": "Lost sync / Relay timeout",
          "score": 7.1132
        }
      ],
      "top_error_endpoints": [
        {
          "endpoint": "/telemetry/ingest",
          "error_count": 24
        },
        {
          "endpoint": "/api/login",
          "error_count": 10
        },
        {
          "endpoint": "/api/search",
          "error_count": 6
        },
        {
          "endpoint": "/relay/marslink",
          "error_count": 4
        },
        {
          "endpoint": "/compute/node",
          "error_count": 1
        },
        {
          "endpoint": "/sensor/upload",
          "error_count": 1
        }], // trimmed to keep UI readable – you can paste full array if you want
    latest_metrics: {},
  },
};

export default function RCAPage() {
  const [rca] = useState<RCAResponse>(STATIC_RCA.rca);
  const [context] = useState<any>(STATIC_RCA.context_used);
  const generatedAt = "2026-01-02T07:47:05";

  const riskClass =
    rca.risk_level === "low"
      ? "bg-emerald-600"
      : rca.risk_level === "medium"
      ? "bg-amber-500"
      : rca.risk_level === "high"
      ? "bg-orange-600"
      : "bg-red-600";

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              AI Root Cause Analysis
            </h1>

            <p className="text-slate-500 mt-1 text-sm">
              Last analyzed on {new Date(generatedAt).toLocaleString()}
            </p>

            <span className="inline-block mt-2 px-3 py-1 text-xs rounded-full bg-emerald-100 text-emerald-700 border">
              Static RCA Snapshot
            </span>
          </div>

          <button
            disabled
            className="px-5 py-2.5 rounded-xl bg-slate-300 text-slate-600 cursor-not-allowed"
          >
            Static Mode Enabled
          </button>
        </div>

        {/* STAT CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={`rounded-2xl p-6 text-white shadow-sm ${riskClass}`}>
            <p className="text-sm opacity-80">Risk Level</p>
            <p className="text-2xl font-bold uppercase mt-1">{rca.risk_level}</p>
          </div>

          <div className="rounded-2xl p-6 bg-emerald-600 text-white shadow-sm">
            <p className="text-sm opacity-80">Confidence</p>
            <p className="text-2xl font-bold mt-1">
              {(rca.confidence * 100).toFixed(0)}%
            </p>
          </div>

          <div className="rounded-2xl p-6 bg-slate-900 text-white shadow-sm">
            <p className="text-sm opacity-80">Analysis Type</p>
            <p className="text-2xl font-bold mt-1">Log-Based RCA</p>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">

            <Section title="Root Cause">
              {rca.root_cause}
            </Section>

            <Section title="Business / System Impact">
              {rca.impact}
            </Section>

            <Section title="Affected Components">
              <div className="flex flex-wrap gap-2">
                {rca.affected_endpoints.map((ep, i) => (
                  <span
                    key={i}
                    className="px-4 py-1.5 rounded-full bg-slate-200 text-sm text-slate-700"
                  >
                    {ep}
                  </span>
                ))}
              </div>
            </Section>

            <Section title="Recommended Corrective Actions">
              <ul className="list-disc pl-6 space-y-2 text-slate-700">
                {rca.recommended_actions.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </Section>
          </div>

          {/* RIGHT PANEL */}
          <div className="space-y-6">

            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <h3 className="font-semibold mb-2 text-slate-900">
                AI Assessment Notes
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                This RCA snapshot is derived from AI-assisted log correlation and anomaly detection.
              </p>
            </div>

            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <h3 className="font-semibold mb-2 text-slate-900">
                Context Used
              </h3>

              <div className="bg-slate-100 rounded-xl p-4 max-h-72 overflow-y-auto text-xs text-slate-700 shadow-inner">
                <pre>{JSON.stringify(context, null, 2)}</pre>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border bg-white shadow-sm p-6">
      <h2 className="font-semibold text-slate-900 mb-3">{title}</h2>
      <div className="leading-relaxed text-slate-700">{children}</div>
    </div>
  );
}
