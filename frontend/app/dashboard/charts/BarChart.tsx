"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function HorizontalBar({ data }: { data: any[] }) {
  if (!data || data.length === 0) return <p>No data available</p>;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart layout="vertical" data={data}>
        <XAxis type="number" />
        <YAxis dataKey="endpoint" type="category" />
        <Tooltip />
        <Bar dataKey="error_count" fill="#3b82f6" />
      </BarChart>
    </ResponsiveContainer>
  );
}
