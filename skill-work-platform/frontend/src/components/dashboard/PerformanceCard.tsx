"use client";

import React from "react";
import Link from "next/link";
import { Award, Star, CheckCircle, Shield, ArrowRight } from "lucide-react";
import { ProgressBar } from "../common/ProgressBar";
import { WorkerPerformance, WorkerLevel } from "@/types/user";

interface PerformanceCardProps {
  performance: WorkerPerformance | null;
  level?: WorkerLevel;
}

export const PerformanceCard: React.FC<PerformanceCardProps> = ({
  performance,
  level,
}) => {
  const levelTitle = level?.title || "Skilled";
  const levelNum = level?.level_number || 3;
  const rating = performance?.average_rating || 4.8;
  const completion = performance?.completion_rate || 97;
  const onTime = performance?.on_time_delivery_rate || 96;

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
              backgroundColor: "#FEF3C7",
              color: "#D97706",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Award size={18} />
          </div>
          <h4 style={{ fontSize: "1rem", fontWeight: 700, color: "#0F172A" }}>Worker Performance</h4>
        </div>
        <Link
          href="/profile"
          style={{ fontSize: "0.82rem", fontWeight: 700, color: "#0284C7", display: "flex", alignItems: "center", gap: "4px" }}
        >
          Details <ArrowRight size={14} />
        </Link>
      </div>

      {/* Level Tag & Progress */}
      <div style={{ marginBottom: "16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
          <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "#0284C7", textTransform: "uppercase" }}>
            LEVEL {levelNum} — {levelTitle}
          </span>
          <span style={{ fontSize: "0.8rem", color: "#64748B", fontWeight: 600 }}>82% to Level 4</span>
        </div>
        <ProgressBar progress={82} color="#0284C7" height={6} />
      </div>

      {/* Metric Tiles */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", textAlign: "center" }}>
        <div style={{ padding: "8px", backgroundColor: "#F8FCFF", borderRadius: "8px", border: "1px solid #F1F5F9" }}>
          <div style={{ fontSize: "0.7rem", color: "#64748B", fontWeight: 500 }}>Rating</div>
          <div style={{ fontSize: "1.05rem", fontWeight: 800, color: "#0F172A", display: "flex", alignItems: "center", justifyContent: "center", gap: "3px", marginTop: "2px" }}>
            <Star size={13} fill="#F59E0B" color="#F59E0B" />
            {rating}
          </div>
        </div>

        <div style={{ padding: "8px", backgroundColor: "#F8FCFF", borderRadius: "8px", border: "1px solid #F1F5F9" }}>
          <div style={{ fontSize: "0.7rem", color: "#64748B", fontWeight: 500 }}>Completion</div>
          <div style={{ fontSize: "1.05rem", fontWeight: 800, color: "#16A34A", marginTop: "2px" }}>
            {completion}%
          </div>
        </div>

        <div style={{ padding: "8px", backgroundColor: "#F8FCFF", borderRadius: "8px", border: "1px solid #F1F5F9" }}>
          <div style={{ fontSize: "0.7rem", color: "#64748B", fontWeight: 500 }}>On-Time</div>
          <div style={{ fontSize: "1.05rem", fontWeight: 800, color: "#0284C7", marginTop: "2px" }}>
            {onTime}%
          </div>
        </div>
      </div>
    </div>
  );
};
