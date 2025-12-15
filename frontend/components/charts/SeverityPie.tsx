"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const COLORS = ["#22C55E", "#FACC15", "#F97316", "#EF4444"];

export default function SeverityPie({ data }: { data: any[] }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5 h-[260px]">
      <h3 className="text-sm font-medium text-gray-600 mb-4">
        Severity Distribution
      </h3>

      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={90}
            label
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
