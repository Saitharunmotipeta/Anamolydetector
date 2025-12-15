import Link from "next/link";

const navItems = [
  { name: "Dashboard", path: "/dashboard" },
  { name: "Upload Logs", path: "/upload" },
  { name: "Metrics", path: "/metrics" },
  { name: "Reports", path: "/reports" },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r min-h-screen px-4 py-6">
      <h2 className="text-xl font-bold text-indigo-600 mb-8">
        Anomaly Detector
      </h2>

      <nav className="space-y-3">
        {navItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className="block px-3 py-2 rounded-lg text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition"
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
