"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Zap, Bell, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/common/Button";

export default function NotificationSettingsPage() {
  const [instantAlerts, setInstantAlerts] = useState(true);
  const [soundAlerts, setSoundAlerts] = useState(true);
  const [dailyDigest, setDailyDigest] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ maxWidth: "680px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <Link
          href="/settings"
          style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "0.9rem", fontWeight: 700, color: "#0284C7" }}
        >
          <ArrowLeft size={16} /> Back to Settings
        </Link>
      </div>

      <PageHeader title="Notification Preferences" subtitle="Control delivery channels for critical work opportunities." />

      <div style={{ backgroundColor: "#FFFFFF", borderRadius: "16px", border: "1px solid #E2E8F0", padding: "28px", display: "flex", flexDirection: "column", gap: "20px" }}>
        {/* Critical work section */}
        <div style={{ backgroundColor: "#F0F9FF", border: "1px solid #BAE6FD", borderRadius: "12px", padding: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#0284C7", fontWeight: 800, marginBottom: "4px" }}>
            <Zap size={18} fill="#0284C7" />
            <span>CRITICAL WORK ALLOCATIONS (SEPARATE PRIORITY)</span>
          </div>
          <p style={{ fontSize: "0.85rem", color: "#475569" }}>
            These alerts trigger the moment a vacancy opens matching your verified skill set. They bypass marketing channels to guarantee immediate opportunity access.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
            <div>
              <div style={{ fontWeight: 700, color: "#0F172A", fontSize: "0.95rem" }}>Instant Push & In-App Work Alerts</div>
              <div style={{ fontSize: "0.82rem", color: "#64748B" }}>Receive desktop & mobile popups when a task is allocated to you.</div>
            </div>
            <input type="checkbox" checked={instantAlerts} onChange={(e) => setInstantAlerts(e.target.checked)} style={{ width: "18px", height: "18px", accentColor: "#0284C7" }} />
          </label>

          <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
            <div>
              <div style={{ fontWeight: 700, color: "#0F172A", fontSize: "0.95rem" }}>Sound Notification for Instant Tasks</div>
              <div style={{ fontSize: "0.82rem", color: "#64748B" }}>Play an alert chime when a grab-work opportunity arrives.</div>
            </div>
            <input type="checkbox" checked={soundAlerts} onChange={(e) => setSoundAlerts(e.target.checked)} style={{ width: "18px", height: "18px", accentColor: "#0284C7" }} />
          </label>

          <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
            <div>
              <div style={{ fontWeight: 700, color: "#0F172A", fontSize: "0.95rem" }}>Daily Digest Email</div>
              <div style={{ fontSize: "0.82rem", color: "#64748B" }}>Summary of daily earnings and skill upgrade recommendations.</div>
            </div>
            <input type="checkbox" checked={dailyDigest} onChange={(e) => setDailyDigest(e.target.checked)} style={{ width: "18px", height: "18px", accentColor: "#0284C7" }} />
          </label>
        </div>

        {saved && <div style={{ color: "#16A34A", fontSize: "0.88rem", fontWeight: 600 }}>Preferences saved.</div>}

        <Button variant="primary" size="md" onClick={handleSave}>
          Save Notification Settings
        </Button>
      </div>
    </div>
  );
}
