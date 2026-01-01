"use client";

import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

interface Props {
  data: {
    endpoint: string;
    error_count: number;
  }[];
}

export default function BarChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <ReBarChart data={data}>
        <XAxis dataKey="endpoint" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="error_count" />
      </ReBarChart>
    </ResponsiveContainer>
  );
}
