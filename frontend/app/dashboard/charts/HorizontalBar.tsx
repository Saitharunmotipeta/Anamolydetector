"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function HorizontalBar({ data, dataKey = "value", labelKey = "label" }: {
  data: any[];
  dataKey?: string;
  labelKey?: string;
}) {
  if (!data || data.length === 0) return <p>No data available</p>;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart layout="vertical" data={data}>
        <XAxis type="number" />
        <YAxis
          type="category"
          dataKey={labelKey}
          width={140}
        />
        <Tooltip />
        <Bar dataKey={dataKey} fill="#3b82f6" />
      </BarChart>
    </ResponsiveContainer>
  );
}
