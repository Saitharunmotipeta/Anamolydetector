"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

const SEVERITIES = ["all", "low", "medium", "high", "critical"];

export default function ReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    api.get("/anomalies/").then(res => setReports(res.data));
  }, []);

  const filteredReports =
    filter === "all"
      ? reports
      : reports.filter(r => r.severity === filter);

  return (
    <div className="min-h-screen bg-[#F7F8FC] p-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-2">
        Incident Reports
      </h1>
      <p className="text-sm text-gray-500 mb-6">
        Detected anomalies and system issues from uploaded logs
      </p>

      {/* Filters */}
      <div className="flex gap-3 mb-6 flex-wrap">
        {SEVERITIES.map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition
              ${
                filter === s
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-600 border hover:bg-gray-50"
              }`}
          >
            {s.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Report Cards */}
      <div className="grid grid-cols-1 gap-4">
        {filteredReports.map((r, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-sm p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-l-4"
            style={{ borderColor: severityBorder(r.severity) }}
          >
            {/* Left */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className={`badge ${severityBadge(r.severity)}`}>
                  {r.severity.toUpperCase()}
                </span>
                <span className="text-sm text-gray-400">
                  {new Date(r.timestamp).toLocaleString()}
                </span>
              </div>

              <div className="text-sm font-medium text-gray-800">
                {r.type}
              </div>

              <div className="text-sm text-gray-500 mt-1">
                {r.message || "No message available"}
              </div>
            </div>

            {/* Right */}
            <div className="text-sm text-gray-400">
              ID #{r.id ?? i + 1}
            </div>
          </div>
        ))}

        {filteredReports.length === 0 && (
          <div className="text-center text-gray-400 py-12">
            No reports found for selected filter
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------- Helpers ---------------- */

function severityBadge(sev: string) {
  if (sev === "critical") return "bg-red-100 text-red-700";
  if (sev === "high") return "bg-orange-100 text-orange-700";
  if (sev === "medium") return "bg-yellow-100 text-yellow-700";
  return "bg-green-100 text-green-700";
}

function severityBorder(sev: string) {
  if (sev === "critical") return "#DC2626";
  if (sev === "high") return "#F97316";
  if (sev === "medium") return "#EAB308";
  return "#16A34A";
}
