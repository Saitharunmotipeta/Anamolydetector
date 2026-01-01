"use client";

import { useEffect, useState } from "react";
import PieChart from "./charts/PieChart";// adjust path if needed
import { api } from "../lib/api"; // axios instance
import axios from "axios";

// --------------------
// Types
// --------------------
interface LogTypeMetric {
  type: string;
  count: number;
}

interface MetricsResponse {
  total_logs: number;
  critical: number;
  high: number;
  low: number;
  types: LogTypeMetric[];
}

// --------------------
// Page
// --------------------
export default function DashboardPage() {
  const [metrics, setMetrics] = useState<MetricsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --------------------
  // Fetch metrics
  // --------------------
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
      "http://localhost:8000/metrics/summary"
    );
        setMetrics(res.data);
      } catch (err: any) {
        setError("Failed to load dashboard metrics");
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  // --------------------
  // Loading state
  // --------------------
  if (loading) {
    return (
      <div className="p-6 text-gray-600">
        Loading dashboard...
      </div>
    );
  }

  // --------------------
  // Error state
  // --------------------
  if (error) {
    return (
      <div className="p-6 text-red-600">
        {error}
      </div>
    );
  }

  // --------------------
  // Main UI
  // --------------------
  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <SummaryCard title="Total Logs" value={metrics?.total_logs ?? 0} />
        <SummaryCard title="Critical" value={metrics?.critical ?? 0} />
        <SummaryCard title="High" value={metrics?.high ?? 0} />
        <SummaryCard title="Low" value={metrics?.low ?? 0} />
      </div>

      {/* Pie Chart */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-4">
          Logs by Type
        </h2>

        {/* SAFE: metrics?.types may be undefined */}
        <PieChart data={metrics?.types} />
      </div>
    </div>
  );
}

// --------------------
// Small reusable card
// --------------------
function SummaryCard({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}