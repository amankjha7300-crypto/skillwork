"use client";

import React from "react";
import Link from "next/link";
import { User, Shield, Bell, CreditCard, ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";

export default function SettingsPage() {
  const sections = [
    { title: "Account Settings", desc: "Manage full name, contact information, headline, and bio.", href: "/settings/account", icon: User },
    { title: "Security & Passwords", desc: "Change password and review active device sessions.", href: "/settings/security", icon: Shield },
    { title: "Work Allocation Notifications", desc: "Configure work alerts and email or push preferences.", href: "/settings/notifications", icon: Bell },
    { title: "Payment & Payout Methods", desc: "Configure default UPI ID or Bank account for instant withdrawals.", href: "/settings/payments", icon: CreditCard },
  ];

  return (
    <div style={{ maxWidth: "760px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}>
      <PageHeader
        title="Settings & Preferences"
        subtitle="Manage your profile, security, payout details, and allocation alerts."
      />

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {sections.map((sec, i) => {
          const Icon = sec.icon;
          return (
            <Link
              key={i}
              href={sec.href}
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "14px",
                border: "1px solid #E2E8F0",
                padding: "20px 24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                boxShadow: "0 2px 4px rgba(15, 23, 42, 0.04)",
                transition: "all 0.15s ease",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "10px",
                    backgroundColor: "#E0F2FE",
                    color: "#0284C7",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#0F172A" }}>{sec.title}</h3>
                  <p style={{ fontSize: "0.85rem", color: "#64748B", marginTop: "2px" }}>{sec.desc}</p>
                </div>
              </div>
              <ChevronRight size={18} color="#94A3B8" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
