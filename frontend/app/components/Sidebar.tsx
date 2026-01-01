"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Upload,
  BarChart3,
  Brain,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Upload", href: "/upload", icon: Upload },
  { label: "Metrics", href: "/metrics", icon: BarChart3 },
  { label: "RCA Analysis", href: "/rca", icon: Brain },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[260px] bg-[#0B1220] border-r border-[#1E293B] flex flex-col">
      
      {/* BRAND */}
      <div className="px-6 py-8">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-cyan-500/10 flex items-center justify-center">
            <span className="text-cyan-400 font-bold text-lg">A</span>
          </div>
          <div>
            <h1 className="text-base font-semibold text-white">
              Anomaly Detector
            </h1>
            <p className="text-xs text-slate-400">
              Log Intelligence Platform
            </p>
          </div>
        </div>
      </div>

      {/* NAV */}
      <nav className="px-4 space-y-1">
        {navItems.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-4 py-2.5 rounded-md text-sm
                transition-all
                ${
                  active
                    ? "bg-[#1E293B] text-white"
                    : "text-slate-400 hover:text-white hover:bg-[#111827]"
                }
              `}
            >
              <Icon size={18} className={active ? "text-cyan-400" : ""} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* FOOTER */}
      <div className="mt-auto px-6 py-6 text-xs text-slate-500">
        <p>System Monitoring</p>
        <p className="mt-1">AI & ML Driven Analytics</p>
      </div>
    </aside>
  );
}