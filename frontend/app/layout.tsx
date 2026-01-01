"use client";

import "./globals.css";
import { usePathname } from "next/navigation";
import Sidebar from "./components/Sidebar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const showSidebar =
    pathname !== "/";

  return (
    <html lang="en">
      <body className="bg-white text-slate-800">
        {showSidebar ? (
          <div className="flex min-h-screen bg-[#0B0F1A] text-white">
            <Sidebar />
            <main className="flex-1 p-8 overflow-y-auto">
              {children}
            </main>
          </div>
        ) : (
          <main>{children}</main>
        )}
      </body>
    </html>
  );
}