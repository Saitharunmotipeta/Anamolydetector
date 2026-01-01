"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function ErrorTrend({ data }: { data: any[] }) {
  if (!data || data.length === 0) return <p>No data available</p>;

  const values = data.map((d) => d.errors ?? 0);

  const min = Math.min(...values);
  const max = Math.max(...values);

  // tighten Y range so slope is visible
  const padding = Math.max(1, Math.round((max - min) * 0.2));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />

        <XAxis dataKey="label" />

        <YAxis
          domain={[min - padding, max + padding]}
          allowDecimals={false}
        />

        <Tooltip />

        <Line
          type="monotone"
          dataKey="errors"
          stroke="#2563eb"
          strokeWidth={2.5}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
