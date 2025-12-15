"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import ErrorTrend from "@/components/charts/ErrorTrend";
import SeverityPie from "@/components/charts/SeverityPie";

type Summary = {
  total_logs: number;
  error_count: number;
  error_rate: number;
  avg_response_time: number;
};

export default function Dashboard() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [trend, setTrend] = useState<any[]>([]);
  const [severity, setSeverity] = useState<any[]>([]);

  useEffect(() => {
    // KPI metrics
    api.get("/metrics/summary").then(res => setSummary(res.data));

    // Charts data
    api.get("/anomalies/").then(res => {
      const data = res.data;

      /* ---------------- Severity Pie ---------------- */
      const sevCount: any = {
        low: 0,
        medium: 0,
        high: 0,
        critical: 0,
      };

      data.forEach((a: any) => {
        if (a.severity && sevCount[a.severity] !== undefined) {
          sevCount[a.severity]++;
        }
      });

      setSeverity(
        Object.entries(sevCount).map(([key, value]) => ({
          name: key,
          value,
        }))
      );

      /* ---------------- Error Trend ---------------- */
      // Static buckets for now (Power BI later)
      const buckets = data.slice(0, 15).map((_: any, i: number) => ({
        time: `T${i + 1}`,
        count: Math.floor(Math.random() * 10) + 1,
      }));

      setTrend(buckets);
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#F7F8FC] p-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        System Dashboard
      </h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
        <Card title="Total Logs" value={summary?.total_logs} color="indigo" />
        <Card title="Errors" value={summary?.error_count} color="red" />
        <Card
          title="Error Rate"
          value={`${(summary?.error_rate ?? 0) * 100}%`}
          color="yellow"
        />
        <Card
          title="Avg Response Time"
          value={`${summary?.avg_response_time} ms`}
          color="green"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ErrorTrend data={trend} />
        <SeverityPie data={severity} />
      </div>
    </div>
  );
}

/* ---------------- KPI Card ---------------- */

function Card({ title, value, color }: any) {
  const colors: any = {
    indigo: "text-indigo-600",
    red: "text-red-500",
    yellow: "text-yellow-500",
    green: "text-green-500",
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <div className="text-sm text-gray-500">{title}</div>
      <div className={`text-2xl font-bold mt-2 ${colors[color]}`}>
        {value ?? "--"}
      </div>
    </div>
  );
}
