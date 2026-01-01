"use client";

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = [
  "#2563eb",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
  "#84cc16",
];

export default function ClusterScatter({
  data,
}: {
  data: { x: number; y: number; cluster: number }[];
}) {
  if (!data || data.length === 0) return <p>No data available</p>;

  // group data by cluster id
  const clusters: Record<string, any[]> = {};

  data.forEach((p) => {
    const key = String(p.cluster);
    if (!clusters[key]) clusters[key] = [];
    clusters[key].push(p);
  });

  return (
    <ResponsiveContainer width="100%" height={320}>
      <ScatterChart>
        <CartesianGrid strokeDasharray="3 3" />

        <XAxis
          type="number"
          dataKey="x"
          name="Log Index"
          tick={{ fontSize: 12 }}
        />

        <YAxis
          type="number"
          dataKey="y"
          name="Response Time (ms)"
          tick={{ fontSize: 12 }}
        />

        <Tooltip cursor={{ strokeDasharray: "3 3" }} />

        <Legend />

        {Object.keys(clusters).map((key, i) => (
          <Scatter
            key={key}
            name={key === "-1" ? "Outliers" : `Cluster ${key}`}
            data={clusters[key]}
            fill={COLORS[i % COLORS.length]}
            shape="circle"
          />
        ))}
      </ScatterChart>
    </ResponsiveContainer>
  );
}
