"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import RecentAnomalies from "@/components/tables/RecentAnomalies";


export default function Home() {
  const [msg, setMsg] = useState("Checking backend...");
  const [err, setErr] = useState("");
  const [trend, setTrend] = useState<any[]>([]);
const [severity, setSeverity] = useState<any[]>([]);

useEffect(() => {
  api.get("/metrics/daily").then(res => {
    const formatted = res.data.map((d: any, i: number) => ({
      date: `Day ${i + 1}`,
      error_count: d.error_count ?? 0,
    }));
    setTrend(formatted);
  });

  api.get("/metrics/summary").then(res => {
    const sev = res.data.severity || {};
    setSeverity([
      { name: "Low", value: sev.low || 0 },
      { name: "Medium", value: sev.medium || 0 },
      { name: "High", value: sev.high || 0 },
      { name: "Critical", value: sev.critical || 0 },
    ]);
  });
}, []);

  useEffect(() => {
    api.get("/")
      .then((res) => {
        console.log("SUCCESS:", res.data);
        setMsg("Backend Connected ✅");
      })
      .catch((e) => {
        console.error("ERROR:", e);
        setMsg("Backend NOT Connected ❌");
        setErr(e?.message || "unknown error");
      });
  }, []);

  return (
    <main className="p-10 text-xl font-bold">
      <div>{msg}</div>
      {err && <pre className="text-sm text-red-500 mt-4">{err}</pre>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
</div>
<div className="mt-6">
  <RecentAnomalies />
</div>

    </main>
  );
}
