"use client";

import {
  PieChart as RePieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";

interface PieChartData {
  type: string;
  count: number;
}

interface Props {
  data?: PieChartData[];
}

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#A28BFE",
  "#FF5C5C",
];

export default function PieChart({ data = [] }: Props) {
  if (data.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center text-gray-500">
        No data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RePieChart>
        <Pie
          data={data as any[]}   
          dataKey="count"
          nameKey="type"
          outerRadius={100}
          label
        >
          {data.map((_, index) => (
            <Cell
              key={index}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>

        <Tooltip />
        <Legend />
      </RePieChart>
    </ResponsiveContainer>
  );
}