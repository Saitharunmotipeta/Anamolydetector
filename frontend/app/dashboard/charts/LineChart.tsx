"use client";

import {
  LineChart as ReLineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

interface Props {
  data: { name: string; value: number }[];
}

export default function LineChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <ReLineChart data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="value"
          strokeWidth={2}
        />
      </ReLineChart>
    </ResponsiveContainer>
  );
}
