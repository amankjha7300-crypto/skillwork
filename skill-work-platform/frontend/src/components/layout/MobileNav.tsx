"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Zap, CheckSquare, Award, Wallet } from "lucide-react";

export const MobileNav: React.FC = () => {
  const pathname = usePathname();

  if (pathname === "/" || pathname === "/login" || pathname === "/signup") {
    return null;
  }

  const items = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Work", href: "/work", icon: Zap },
    { label: "Tasks", href: "/tasks", icon: CheckSquare },
    { label: "Skills", href: "/skills", icon: Award },
    { label: "Earnings", href: "/earnings", icon: Wallet },
  ];

  return (
    <nav
      className="mobile-bottom-nav"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 200,
        backgroundColor: "#FFFFFF",
        borderTop: "1px solid #E2E8F0",
        padding: "8px 12px 14px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        boxShadow: "0 -4px 10px rgba(15, 23, 42, 0.04)",
      }}
    >
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));

        return (
          <Link
            key={item.href}
            href={item.href}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "4px",
              padding: "4px 8px",
              fontSize: "0.75rem",
              fontWeight: isActive ? 700 : 500,
              color: isActive ? "#0284C7" : "#64748B",
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: isActive ? "#E0F2FE" : "transparent",
                color: isActive ? "#0284C7" : "#64748B",
              }}
            >
              <Icon size={20} />
            </div>
            <span>{item.label}</span>
          </Link>
        );
      })}
      <style>{`
        @media (min-width: 769px) {
          .mobile-bottom-nav {
            display: none !important;
          }
        }
      `}</style>
    </nav>
  );
};
