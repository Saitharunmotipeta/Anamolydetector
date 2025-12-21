"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

type Anomaly = {
  id: number;
  timestamp: string;
  type: string;
  severity: string;
  score?: number;
  message?: string;
};

export default function RecentAnomalies() {
  const [items, setItems] = useState<Anomaly[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnomalies = async () => {
      try {
        const res = await api.get("/anomalies");

        // HARD GUARD — backend must return array
        const data = Array.isArray(res.data) ? res.data : [];

        setItems(data.slice(0, 8));
      } catch (err: any) {
        console.error("Failed to load anomalies", err);
        setError("Failed to load anomalies");
      } finally {
        setLoading(false);
      }
    };

    fetchAnomalies();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <h3 className="text-sm font-medium text-gray-600 mb-4">
        Recent Anomalies
      </h3>

      {loading && (
        <div className="text-sm text-gray-400">Loading…</div>
      )}

      {!loading && error && (
        <div className="text-sm text-red-500">{error}</div>
      )}

      {!loading && !error && items.length === 0 && (
        <div className="text-sm text-gray-400">
          No anomalies found
        </div>
      )}

      {!loading && !error && items.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="pb-2">Time</th>
                <th className="pb-2">Type</th>
                <th className="pb-2">Severity</th>
                <th className="pb-2">Message</th>
              </tr>
            </thead>

            <tbody>
              {items.map((a) => (
                <tr key={a.id} className="border-b last:border-0">
                  <td className="py-2 text-gray-400">
                    {new Date(a.timestamp).toLocaleString()}
                  </td>
                  <td className="py-2">{a.type}</td>
                  <td
                    className={`py-2 font-medium ${severityColor(
                      a.severity
                    )}`}
                  >
                    {a.severity}
                  </td>
                  <td className="py-2 text-gray-500 truncate max-w-[300px]">
                    {a.message || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function severityColor(sev: string) {
  switch (sev) {
    case "critical":
      return "text-red-600";
    case "high":
      return "text-orange-500";
    case "medium":
      return "text-yellow-500";
    default:
      return "text-green-600";
  }
}
