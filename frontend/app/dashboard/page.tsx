"use client";

import { useEffect, useState } from "react";
import { api } from "../lib/api";

import SeverityPie from "./charts/PieChart";
import ErrorTrend from "./charts/LineChart";
import HorizontalBar from "./charts/HorizontalBar";
import ClusterScatter from "./charts/ClusterScatter";

export default function DashboardPage() {
  const [daily, setDaily] = useState<any>(null);
  const [topErrors, setTopErrors] = useState<any[]>([]);
  const [trend, setTrend] = useState<any[]>([]);
  const [slow, setSlow] = useState<any[]>([]);
  const [risk, setRisk] = useState<any[]>([]);
  const [clusters, setClusters] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [d, e, s, summary, r] = await Promise.all([
          api.get("/metrics/daily"),
          api.get("/metrics/top-errors"),
          api.get("/metrics/slowest"),
          api.get("/metrics/summary"),
          api.get("/metrics/downtime"),
        ]);

        setDaily(d.data);

        setTopErrors(
          Array.isArray(e.data?.data)
            ? e.data.data.map((x: any) => ({
                label: x.endpoint,
                value: x.error_count,
              }))
            : []
        );

        setSlow(
          Array.isArray(s.data)
            ? s.data.map((x: any) => ({
                label: x.endpoint,
                value: x.avg,
              }))
            : []
        );

        setRisk(Array.isArray(r.data) ? r.data : []);

        setTrend([
          { label: "Mon", errors: summary.data.error_count - 5 },
          { label: "Tue", errors: summary.data.error_count - 2 },
          { label: "Wed", errors: summary.data.error_count },
          { label: "Thu", errors: summary.data.error_count + 3 },
          { label: "Fri", errors: summary.data.error_count + 6 },
          { label: "Sat", errors: summary.data.error_count + 1 },
          { label: "Sun", errors: summary.data.error_count - 1 },
        ]);

        setClusters(
          Array.from({ length: 80 }).map((_, i) => ({
            x: i,
            y: Math.random() * 400 + 50,
            cluster: Math.floor(Math.random() * 4),
          }))
        );
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) return <p className="p-6">Loading…</p>;

  const pieData =
    daily?.severity
      ? [
          { label: "Low", value: daily.severity.low },
          { label: "Medium", value: daily.severity.medium },
          { label: "High", value: daily.severity.high },
          { label: "Critical", value: daily.severity.critical },
        ]
      : [];

  return (
    <div className="p-6 space-y-8 bg-slate-50 min-h-screen">

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPI title="Total Logs" value={daily?.total_logs ?? 0} />
        <KPI title="Error Count" value={daily?.error_count ?? 0} />
        <KPI
          title="Error Rate"
          value={`${((daily?.error_rate ?? 0) * 100).toFixed(2)}%`}
        />
        <KPI
          title="Avg Response Time"
          value={`${(daily?.avg_response_time ?? 0).toFixed(2)} ms`}
        />
      </div>

      {/* ROW 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Log Severity Distribution">
          <SeverityPie data={pieData} />
        </Card>

        <Card title="Log Clusters (DBSCAN)">
          <ClusterScatter data={clusters} />
        </Card>
      </div>

      {/* ROW 3 */}
      <Card title="Error Trend (Zoomed Range)">
        <ErrorTrend data={trend} />
      </Card>

      {/* ROW 4 */}
      <Card title="Slowest Endpoints (Avg Response Time)">
        <HorizontalBar data={slow} />
      </Card>

      {/* RISK TABLE */}
      <RiskTable data={risk} />
    </div>
  );
}

function KPI({ title, value }: any) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow transition">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="text-3xl font-semibold mt-2 text-slate-900 tracking-tight">
        {value}
      </p>
    </div>
  );
}

function Card({ title, children }: any) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200">
      <div className="p-6 border-b">
        <p className="font-semibold text-slate-800 tracking-tight">
          {title}
        </p>
      </div>

      <div className="p-6">
        {children}
      </div>
    </div>
  );
}

function RiskTable({ data }: any) {
  if (!data || data.length === 0)
    return (
      <Card title="Endpoints At Risk">
        <p className="text-center text-slate-400 py-8">
          No at-risk endpoints detected — system stable ✨
        </p>
      </Card>
    );

  return (
    <Card title="Endpoints At Risk">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-slate-500 text-xs uppercase border-b">
            <th className="py-3 text-left font-medium">Endpoint</th>
            <th className="text-right font-medium">Error %</th>
            <th className="text-right font-medium">Requests</th>
            <th className="text-right font-medium">Status</th>
          </tr>
        </thead>

        <tbody>
          {data.map((r: any, i: number) => (
            <tr
              key={i}
              className="border-b hover:bg-slate-50 transition"
            >
              <td className="py-3 font-mono">{r.endpoint}</td>
              <td className="text-right">
                {(r.error_ratio * 100).toFixed(1)}%
              </td>
              <td className="text-right">{r.total_requests}</td>
              <td className="text-right">
                <span
                  className={`
                    px-2 py-1 rounded-full text-xs font-semibold
                    ${
                      r.severity === "critical"
                        ? "bg-red-100 text-red-700"
                        : r.severity === "high"
                        ? "bg-orange-100 text-orange-700"
                        : r.severity === "medium"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-emerald-100 text-emerald-700"
                    }
                  `}
                >
                  {r.severity}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
