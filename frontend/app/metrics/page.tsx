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
    api.get("/metrics/summary").then(res => setSummary(res.data));
    api.get("/metrics/top-errors").then(res => setTopErrors(res.data));

    api.get("/anomalies/").then(res => {
      const sevCount: any = { low: 0, medium: 0, high: 0, critical: 0 };
      res.data.forEach((a: any) => sevCount[a.severity]++);
      setSeverityData(Object.entries(sevCount).map(([k, v]) => ({ name: k, value: v })));

      // fake time buckets (static trend for now)
      const buckets = res.data.slice(0, 20).map((_: any, i: number) => ({
        time: `T${i + 1}`,
        errors: Math.floor(Math.random() * 10) + 1
      }));
      setTrendData(buckets);
    });
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Metrics & Analysis</h1>

      {/* KPI */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
        <KPI title="Total Logs" value={summary?.total_logs} color="indigo" />
        <KPI title="Errors" value={summary?.error_count} color="red" />
        <KPI title="Error Rate" value={`${(summary?.error_rate ?? 0) * 100}%`} color="yellow" />
        <KPI title="Avg Response Time" value={`${summary?.avg_response_time} ms`} color="green" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <ChartCard title="Top Error Endpoints">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={topErrors}>
              <XAxis dataKey="endpoint" hide />
              <YAxis />
              <Tooltip />
              <Bar dataKey="error_count" fill="#6366F1" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
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
          <div className="h-full flex items-center justify-center text-gray-400">
            Power BI iframe will be embedded here
          </div>
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
      <div className={`text-2xl font-bold mt-2 ${colors[color]}`}>{value ?? "--"}</div>
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
