"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
  LineChart, Line
} from "recharts";

const COLORS = ["#6366F1", "#F59E0B", "#EF4444", "#22C55E"];

export default function MetricsPage() {
  const [summary, setSummary] = useState<any>(null);
  const [topErrors, setTopErrors] = useState<any[]>([]);
  const [severityData, setSeverityData] = useState<any[]>([]);
  const [trendData, setTrendData] = useState<any[]>([]);

  useEffect(() => {
    // SUMMARY
    api.get("/metrics/summary")
      .then(res => setSummary(res.data))
      .catch(console.error);

    // TOP ERRORS (NORMALIZED)
  api.get("/metrics/top-errors")
    .then(res => {
      const raw = Array.isArray(res.data?.data)
        ? res.data.data
        : [];

      setTopErrors(
        raw.map((e: any) => ({
          endpoint: e.endpoint ?? e.path ?? "unknown",
          error_count: e.error_count ?? e.count ?? 0,
        }))
      );
    });



    // ANOMALIES → SEVERITY + TREND
    api.get("/anomalies")
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : [];

        const sevCount: Record<string, number> = {
          low: 0, medium: 0, high: 0, critical: 0,
        };

        data.forEach(a => {
          const key = a.severity?.toLowerCase();
          if (key in sevCount) sevCount[key]++;
        });

        setSeverityData(
          Object.entries(sevCount).map(([name, value]) => ({ name, value }))
        );

        setTrendData(
          data.slice(0, 20).map((_, i) => ({
            time: `T${i + 1}`,
            errors: Math.floor(Math.random() * 10) + 1,
          }))
        );
      })
      .catch(console.error);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Metrics & Analysis</h1>

      {/* KPI */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
        <KPI title="Total Logs" value={summary?.total_logs} color="indigo" />
        <KPI title="Errors" value={summary?.error_count} color="red" />
        <KPI
          title="Error Rate"
          value={`${((summary?.error_rate ?? 0) * 100).toFixed(1)}%`}
          color="yellow"
        />
        <KPI
          title="Avg Response Time"
          value={summary?.avg_response_time ? `${summary.avg_response_time} ms` : "--"}
          color="green"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-blue-700">
        <ChartCard title="Errors by Severity" >
          {severityData.length === 0 ? (
            <Empty />
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={severityData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#EF4444" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>


        <ChartCard title="Severity Distribution">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={severityData} dataKey="value" nameKey="name" outerRadius={90}>
                {severityData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Error Trend">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={trendData}>
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="errors" stroke="#EF4444" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Power BI (Coming Soon)">
          <Empty />
        </ChartCard>
      </div>
    </div>
  );
}

function KPI({ title, value, color }: any) {
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

function ChartCard({ title, children }: any) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <h3 className="text-sm font-medium mb-4">{title}</h3>
      {children}
    </div>
  );
}

function Empty() {
  return (
    <div className="h-[250px] flex items-center justify-center text-gray-400 text-sm">
      No data available
    </div>
  );
}
