"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { api } from "../lib/api";

// ---------- Types ----------
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [d, e, a, s] = await Promise.all([
          api.get("/metrics/daily"),
          api.get("/metrics/top-errors"),
          api.get("/metrics/top-anomalies"),
          api.get("/metrics/slowest"),
        ]);

        setDaily(d.data);

        setTopErrors(
          Array.isArray(e.data?.data)
            ? e.data.data
            : []
        );

        setAnomalies(
          Array.isArray(a.data) ? a.data : []
        );

        setSlowest(
          Array.isArray(s.data) ? s.data : []
        );
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) return <div className="p-10 text-slate-500">Loading metrics…</div>;

  return (
    <div className="flex h-screen bg-slate-50">

      {/* MAIN */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-8 space-y-8">

          {/* KPI */}
          <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <KPI title="Total Logs" value={daily?.total_logs} />
            <KPI title="Errors" value={daily?.error_count} />
            <KPI
              title="Error Rate"
              value={daily ? `${(daily.error_rate * 100).toFixed(2)}%` : "-"}
            />
            <KPI
              title="Avg Response Time"
              value={daily ? `${daily.avg_response_time.toFixed(2)} ms` : "-"}
            />
          </section>

          {/* SEVERITY */}
          <Card title="Severity Distribution">
            {daily ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                <Severity label="Low" value={daily.severity.low} tone="green" />
                <Severity label="Medium" value={daily.severity.medium} tone="amber" />
                <Severity label="High" value={daily.severity.high} tone="orange" />
                <Severity label="Critical" value={daily.severity.critical} tone="red" />
              </div>
            ) : (
              <Empty />
            )}
          </Card>

          {/* TABLES */}
          <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">

            <Card title="Top Error Endpoints">
              {topErrors.length ? (
                <table className="w-full text-sm">
                  <thead className="text-slate-500 border-b">
                    <tr>
                      <th className="py-2 text-left">Endpoint</th>
                      <th className="text-left">Errors</th>
                      <th className="text-left">Error %</th>
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
              ) : (
                <Empty />
              )}
            </Card>

            <Card title="Slowest Endpoints">
              {slowest.length ? (
                slowest.map((s, i) => (
                  <div key={i} className="flex justify-between py-2 border-b last:border-0">
                    <span className="font-mono">{s.endpoint}</span>
                    <span>{s.avg} ms (p95)</span>
                  </div>
                ))
              ) : (
                <Empty />
              )}
            </Card>

          </section>

          <Card title="Frequent Anomaly Types">
            {anomalies.length ? (
              anomalies.map((a, i) => (
                <div key={i} className="flex justify-between py-2 border-b last:border-0">
                  <span>{a.type}</span>
                  <span className="font-medium">{a.count}</span>
                </div>
              ))
            ) : (
              <Empty />
            )}
          </Card>

        </main>
      </div>
    </div>
  );
}

/* ---------- UI ---------- */

function KPI({ title, value }: { title: string; value: any }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border p-6">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="mt-2 text-3xl font-semibold text-slate-900">
        {value ?? "-"}
      </p>
    </div>
  );
}

function Card({ title, children }: any) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border p-6">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">{title}</h2>
      {children}
    </div>
  );
}

function Severity({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "green" | "amber" | "orange" | "red";
}) {
  const toneMap: any = {
    green: "bg-green-50 text-green-700 border-green-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    orange: "bg-orange-50 text-orange-700 border-orange-200",
    red: "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <div className={`rounded-xl border p-5 ${toneMap[tone]}`}>
      <p className="text-sm">{label}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  );
}

function Empty() {
  return (
    <div className="text-sm text-slate-400 py-6">
      No data available
    </div>
  );
}
