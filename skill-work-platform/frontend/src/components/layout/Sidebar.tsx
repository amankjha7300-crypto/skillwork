"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Zap,
  CheckSquare,
  Award,
  Wallet,
  Settings,
  HelpCircle,
  TrendingUp
} from "lucide-react";

export const Sidebar: React.FC = () => {
  const pathname = usePathname();

  // Hide sidebar on auth & landing pages
  if (pathname === "/" || pathname === "/login" || pathname === "/signup") {
    return null;
  }

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Work", href: "/work", icon: Zap },
    { label: "My Tasks", href: "/tasks", icon: CheckSquare },
    { label: "Skills", href: "/skills", icon: Award },
    { label: "Earnings", href: "/earnings", icon: Wallet },
  ];

  const bottomItems = [
    { label: "Improve Skills", href: "/skills/improve", icon: TrendingUp },
    { label: "Settings", href: "/settings", icon: Settings },
    { label: "Help & Support", href: "/help", icon: HelpCircle },
  ];

  return (
    <aside
      className="desktop-sidebar"
      style={{
        width: "240px",
        minHeight: "calc(100vh - 61px)",
        backgroundColor: "#FFFFFF",
        borderRight: "1px solid #E2E8F0",
        padding: "20px 16px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        flexShrink: 0,
      }}
    >
      {/* Top Nav Items */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <div style={{ padding: "0 12px 10px", fontSize: "0.75rem", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.5px" }}>
          Worker Hub
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "10px 14px",
                borderRadius: "10px",
                fontSize: "0.92rem",
                fontWeight: isActive ? 700 : 500,
                color: isActive ? "#0284C7" : "#475569",
                backgroundColor: isActive ? "#E0F2FE" : "transparent",
                transition: "all 0.15s ease",
              }}
            >
              <Icon size={19} color={isActive ? "#0284C7" : "#64748B"} />
              {item.label}
            </Link>
          );
        })}
      </div>

      {/* Bottom Nav Items */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px", borderTop: "1px solid #F1F5F9", paddingTop: "16px" }}>
        {bottomItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "8px 14px",
                borderRadius: "10px",
                fontSize: "0.85rem",
                fontWeight: isActive ? 600 : 500,
                color: isActive ? "#0284C7" : "#64748B",
                backgroundColor: isActive ? "#F0F9FF" : "transparent",
              }}
            >
              <Icon size={17} color={isActive ? "#0284C7" : "#94A3B8"} />
              {item.label}
            </Link>
          );
        })}
      </div>
      <style>{`
        @media (max-width: 768px) {
          .desktop-sidebar {
            display: none !important;
          }
        }
      `}</style>
    </aside>
  );
};
