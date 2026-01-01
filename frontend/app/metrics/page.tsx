"use client";

import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

type DailyMetrics = {
  total_logs: number;
  error_count: number;
  avg_response_time: number;
  error_rate: number;
  severity: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
};

type TopError = {
  endpoint: string;
  error_count: number;
  error_percent: number;
};

type AnomalyType = {
  type: string;
  count: number;
  percent: number;
};

type SlowEndpoint = {
  endpoint: string;
  avg: number;
  p95: number;
  count: number;
};

export default function MetricsPage() {
  const [daily, setDaily] = useState<DailyMetrics | null>(null);
  const [topErrors, setTopErrors] = useState<TopError[]>([]);
  const [anomalies, setAnomalies] = useState<AnomalyType[]>([]);
  const [slowest, setSlowest] = useState<SlowEndpoint[]>([]);

  useEffect(() => {
    fetch("http://localhost:8000/metrics/daily")
      .then(res => res.json())
      .then(setDaily);

    fetch("http://localhost:8000/metrics/top-errors")
      .then(res => res.json())
      .then(setTopErrors);

    fetch("http://localhost:8000/metrics/top-anomalies")
      .then(res => res.json())
      .then(setAnomalies);

    fetch("http://localhost:8000/metrics/slowest")
      .then(res => res.json())
      .then(setSlowest);
  }, []);

  return (
    <div className="flex h-screen bg-slate-100">
      {/* SIDEBAR */}

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-8 space-y-8">

          {/* KPI CARDS */}
          <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <MetricCard title="Total Logs" value={daily?.total_logs} />
            <MetricCard title="Errors" value={daily?.error_count} />
            <MetricCard
              title="Error Rate"
              value={daily ? `${(daily.error_rate * 100).toFixed(2)}%` : "-"}
            />
            <MetricCard
              title="Avg Response Time"
              value={daily ? `${daily.avg_response_time.toFixed(2)} ms` : "-"}
            />
          </section>

          {/* SEVERITY DISTRIBUTION */}
          <section className="bg-white rounded-xl p-6 shadow">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">
              Severity Distribution
            </h2>

            {daily && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <SeverityBox label="Low" value={daily.severity.low} color="green" />
                <SeverityBox label="Medium" value={daily.severity.medium} color="yellow" />
                <SeverityBox label="High" value={daily.severity.high} color="orange" />
                <SeverityBox label="Critical" value={daily.severity.critical} color="red" />
              </div>
            )}
          </section>

          {/* TOP ERROR ENDPOINTS */}
          <section className="bg-white rounded-xl p-6 shadow">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">
              Top Error Endpoints
            </h2>

            <table className="w-full text-sm">
              <thead className="text-left text-slate-500 border-b">
                <tr>
                  <th className="py-2">Endpoint</th>
                  <th>Error Count</th>
                  <th>Error %</th>
                </tr>
              </thead>
              <tbody>
                {topErrors.map((e, i) => (
                  <tr key={i} className="border-b last:border-0">
                    <td className="py-2 font-mono">{e.endpoint}</td>
                    <td>{e.error_count}</td>
                    <td>{(e.error_percent * 100).toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* ANOMALY TYPES + SLOW ENDPOINTS */}
          <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">

            {/* ANOMALY TYPES */}
            <div className="bg-white rounded-xl p-6 shadow">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">
                Frequent Anomaly Types
              </h2>

              {anomalies.map((a, i) => (
                <div key={i} className="flex justify-between py-2 border-b last:border-0">
                  <span>{a.type}</span>
                  <span className="font-medium">{a.count}</span>
                </div>
              ))}
            </div>

            {/* SLOW ENDPOINTS */}
            <div className="bg-white rounded-xl p-6 shadow">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">
                Slowest Endpoints
              </h2>

              {slowest.map((s, i) => (
                <div key={i} className="flex justify-between py-2 border-b last:border-0">
                  <span className="font-mono">{s.endpoint}</span>
                  <span>{s.avg} ms (p95)</span>
                </div>
              ))}
            </div>

          </section>
        </main>
      </div>
    </div>
  );
}

/* ------------------ UI COMPONENTS ------------------ */

function MetricCard({ title, value }: { title: string; value: any }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-800">
        {value ?? "-"}
      </p>
    </div>
  );
}

function SeverityBox({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: "green" | "yellow" | "orange" | "red";
}) {
  const colors: any = {
    green: "bg-green-50 text-green-700",
    yellow: "bg-yellow-50 text-yellow-700",
    orange: "bg-orange-50 text-orange-700",
    red: "bg-red-50 text-red-700",
  };

  return (
    <div className={`rounded-lg p-4 ${colors[color]}`}>
      <p className="text-sm">{label}</p>
      <p className="text-xl font-semibold">{value}</p>
    </div>
  );
}
