"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function Anomalies() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    api.get("/anomalies/")
      .then(res => setItems(res.data));
  }, []);

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Anomalies</h1>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th>Time</th>
            <th>Type</th>
            <th>Severity</th>
            <th>Score</th>
            <th>Message</th>
          </tr>
        </thead>
        <tbody>
          {items.map(a => (
            <tr key={a.id} className="border-t">
              <td>{a.timestamp}</td>
              <td>{a.type}</td>
              <td className={severityColor(a.severity)}>
                {a.severity}
              </td>
              <td>{a.score}</td>
              <td>{a.message}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}

function severityColor(sev: string) {
  if (sev === "critical") return "text-red-600 font-bold";
  if (sev === "high") return "text-orange-600";
  if (sev === "medium") return "text-yellow-600";
  return "text-green-600";
}
