"use client";

import React from "react";
import { CheckSquare } from "lucide-react";
import { ProgressBar } from "../common/ProgressBar";

interface DailyLimitCardProps {
  completedToday: number;
  dailyLimit: number;
}

export const DailyLimitCard: React.FC<DailyLimitCardProps> = ({
  completedToday,
  dailyLimit,
}) => {
  const remaining = Math.max(0, dailyLimit - completedToday);
  const progressPercent = dailyLimit > 0 ? (completedToday / dailyLimit) * 100 : 0;

  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: "16px",
        border: "1px solid #E2E8F0",
        padding: "22px",
        boxShadow: "0 2px 4px rgba(15, 23, 42, 0.04)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
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
            }}
          >
            <CheckSquare size={18} />
          </div>
          <h4 style={{ fontSize: "1rem", fontWeight: 700, color: "#0F172A" }}>Today&apos;s Work</h4>
        </div>
        <span
          style={{
            fontSize: "0.8rem",
            fontWeight: 700,
            padding: "2px 8px",
            borderRadius: "6px",
            backgroundColor: remaining > 0 ? "#DCFCE7" : "#FEE2E2",
            color: remaining > 0 ? "#16A34A" : "#EF4444",
          }}
        >
          {remaining > 0 ? `${remaining} remaining` : "Limit Reached"}
        </span>
      </div>

      <div style={{ marginBottom: "12px" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
          <span style={{ fontSize: "1.75rem", fontWeight: 800, color: "#0F172A" }}>
            {completedToday}
          </span>
          <span style={{ fontSize: "1.1rem", fontWeight: 600, color: "#64748B" }}>
            / {dailyLimit} tasks completed
          </span>
        </div>
      </div>

      <ProgressBar
        progress={progressPercent}
        color={remaining > 0 ? "#38BDF8" : "#F59E0B"}
        height={8}
      />

      <p style={{ fontSize: "0.78rem", color: "#64748B", marginTop: "10px" }}>
        {remaining > 0
          ? "You can grab 1 more task today. Daily limit resets at midnight."
          : "Daily work limit reached. Resets at midnight according to your worker level."}
      </p>
    </div>
  );
};
