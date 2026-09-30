"use client";

import React from "react";
import Link from "next/link";
import { Wallet, ArrowRight, TrendingUp } from "lucide-react";
import { formatINR } from "@/lib/utils";
import { EarningsSummary } from "@/types/earnings";

export const EarningsCard: React.FC<{ earnings: EarningsSummary | null }> = ({ earnings }) => {
  const total = earnings?.total_earned ?? 12450;
  const available = earnings?.available_balance ?? 4970;
  const thisMonth = earnings?.this_month ?? 5820;
  const pending = earnings?.pending_clearance ?? 850;

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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              backgroundColor: "#DCFCE7",
              color: "#16A34A",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Wallet size={18} />
          </div>
          <h4 style={{ fontSize: "1rem", fontWeight: 700, color: "#0F172A" }}>Earnings Overview</h4>
        </div>
        <Link
          href="/earnings"
          style={{ fontSize: "0.82rem", fontWeight: 700, color: "#0284C7", display: "flex", alignItems: "center", gap: "4px" }}
        >
          View All <ArrowRight size={14} />
        </Link>
      </div>

      <div style={{ marginBottom: "18px" }}>
        <div style={{ fontSize: "0.75rem", color: "#64748B", fontWeight: 500 }}>Available to Withdraw</div>
        <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#0F172A", marginTop: "2px" }}>
          {formatINR(available)}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", borderTop: "1px solid #F1F5F9", paddingTop: "14px" }}>
        <div>
          <div style={{ fontSize: "0.75rem", color: "#64748B" }}>Total Earned</div>
          <div style={{ fontSize: "1.05rem", fontWeight: 700, color: "#0F172A", marginTop: "2px" }}>
            {formatINR(total)}
          </div>
        </div>
        <div>
          <div style={{ fontSize: "0.75rem", color: "#64748B" }}>This Month</div>
          <div style={{ fontSize: "1.05rem", fontWeight: 700, color: "#16A34A", marginTop: "2px", display: "flex", alignItems: "center", gap: "4px" }}>
            <TrendingUp size={14} />
            {formatINR(thisMonth)}
          </div>
        </div>
      </div>
    </div>
  );
};
