"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Zap, User, LogOut, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useAvailability } from "@/hooks/useAvailability";
import { useNotifications } from "@/hooks/useNotifications";

export const Navbar: React.FC = () => {
  const { user, profile, logout } = useAuth();
  const { isAvailable, updating, toggleAvailability } = useAvailability();
  const { unreadCount } = useNotifications();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();

  // Hide full navbar on auth & landing page
  if (pathname === "/" || pathname === "/login" || pathname === "/signup") {
    return null;
  }

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        backgroundColor: "#FFFFFF",
        borderBottom: "1px solid #E2E8F0",
        padding: "12px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {/* Brand */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <Link href="/dashboard" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              backgroundColor: "#38BDF8",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#0F172A",
              fontWeight: 800,
            }}
          >
            <Zap size={20} fill="#0F172A" />
          </div>
          <div>
            <span style={{ fontSize: "1.2rem", fontWeight: 800, color: "#0F172A", letterSpacing: "-0.5px" }}>
              SkillWork
            </span>
            <span
              style={{
                marginLeft: "6px",
                fontSize: "0.7rem",
                fontWeight: 700,
                color: "#0284C7",
                backgroundColor: "#E0F2FE",
                padding: "2px 6px",
                borderRadius: "4px",
                textTransform: "uppercase",
              }}
            >
              Worker
            </span>
          </div>
        </Link>
      </div>

      {/* Top Right Controls */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        {/* Availability Switch */}
        <button
          onClick={toggleAvailability}
          disabled={updating}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 14px",
            borderRadius: "9999px",
            backgroundColor: isAvailable ? "#ECFDF5" : "#F1F5F9",
            border: `1px solid ${isAvailable ? "#A7F3D0" : "#CBD5E1"}`,
            color: isAvailable ? "#065F46" : "#475569",
            fontSize: "0.85rem",
            fontWeight: 600,
            transition: "all 0.2s ease",
          }}
          title="Toggle your availability for new work allocations"
        >
          <span
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: isAvailable ? "#10B981" : "#94A3B8",
              boxShadow: isAvailable ? "0 0 0 3px rgba(16, 185, 129, 0.2)" : "none",
            }}
          />
          <span>{isAvailable ? "🟢 Available for Work" : "⚪ Not Available"}</span>
        </button>

        {/* Notifications Icon */}
        <Link
          href="/notifications"
          style={{
            position: "relative",
            width: "40px",
            height: "40px",
            borderRadius: "10px",
            border: "1px solid #E2E8F0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#64748B",
            backgroundColor: "#FFFFFF",
          }}
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span
              style={{
                position: "absolute",
                top: "-4px",
                right: "-4px",
                backgroundColor: "#38BDF8",
                color: "#0F172A",
                fontSize: "0.7rem",
                fontWeight: 700,
                width: "18px",
                height: "18px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 4px rgba(56, 189, 248, 0.4)",
              }}
            >
              {unreadCount}
            </span>
          )}
        </Link>

        {/* Worker Profile Menu */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "4px 8px",
              borderRadius: "10px",
              border: "1px solid #E2E8F0",
              backgroundColor: "#FFFFFF",
            }}
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                backgroundColor: "#E0F2FE",
                color: "#0284C7",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: "0.85rem",
              }}
            >
              {user?.full_name ? user.full_name[0] : "A"}
            </div>
            <div style={{ textAlign: "left", display: "none" }} className="desktop-worker-label">
              <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#0F172A", display: "flex", alignItems: "center", gap: "4px" }}>
                {user?.full_name || "Aman Kumar"}
                {profile?.is_verified_badge && <CheckCircle2 size={13} color="#0284C7" fill="#E0F2FE" />}
              </div>
              <div style={{ fontSize: "0.75rem", color: "#64748B" }}>
                {profile?.headline || "Backend Developer"}
              </div>
            </div>
          </button>

          {dropdownOpen && (
            <div
              style={{
                position: "absolute",
                right: 0,
                top: "calc(100% + 8px)",
                width: "200px",
                backgroundColor: "#FFFFFF",
                borderRadius: "12px",
                boxShadow: "0 10px 15px -3px rgba(15, 23, 42, 0.1), 0 4px 6px -4px rgba(15, 23, 42, 0.05)",
                border: "1px solid #E2E8F0",
                padding: "8px",
                zIndex: 200,
              }}
            >
              <div style={{ padding: "8px 12px", borderBottom: "1px solid #F1F5F9", marginBottom: "4px" }}>
                <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "#0F172A" }}>{user?.full_name || "Aman Kumar"}</p>
                <p style={{ fontSize: "0.75rem", color: "#64748B" }}>{user?.email || "aman@example.com"}</p>
              </div>
              <Link
                href="/profile"
                onClick={() => setDropdownOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 12px",
                  fontSize: "0.85rem",
                  color: "#0F172A",
                  borderRadius: "8px",
                }}
              >
                <User size={16} color="#64748B" />
                My Profile
              </Link>
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  logout();
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 12px",
                  fontSize: "0.85rem",
                  color: "#EF4444",
                  borderRadius: "8px",
                  width: "100%",
                  textAlign: "left",
                }}
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
      <style>{`
        @media (min-width: 640px) {
          .desktop-worker-label {
            display: block !important;
          }
        }
      `}</style>
    </header>
  );
};
