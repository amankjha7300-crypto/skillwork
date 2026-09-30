"use client";

import React from "react";
import { CheckCircle2, Power } from "lucide-react";
import { useAvailability } from "@/hooks/useAvailability";
import { WorkerProfile } from "@/types/user";

export const AvailabilityCard: React.FC<{ profile: WorkerProfile | null }> = ({ profile }) => {
  const { isAvailable, updating, toggleAvailability } = useAvailability();

  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: "16px",
        border: `1px solid ${isAvailable ? "#BAE6FD" : "#E2E8F0"}`,
        padding: "20px 24px",
        boxShadow: "0 2px 8px rgba(15, 23, 42, 0.04)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "16px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "12px",
            backgroundColor: isAvailable ? "#E0F2FE" : "#F1F5F9",
            color: isAvailable ? "#0284C7" : "#64748B",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Power size={24} color={isAvailable ? "#0284C7" : "#94A3B8"} />
        </div>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: isAvailable ? "#10B981" : "#94A3B8",
                boxShadow: isAvailable ? "0 0 0 4px rgba(16, 185, 129, 0.2)" : "none",
              }}
            />
            <h4 style={{ fontSize: "1.05rem", fontWeight: 800, color: isAvailable ? "#0F172A" : "#64748B" }}>
              {isAvailable ? "YOU ARE AVAILABLE FOR WORK" : "YOU ARE CURRENTLY MARKED AS UNAVAILABLE"}
            </h4>
          </div>
          <p style={{ color: "#64748B", fontSize: "0.88rem", marginTop: "4px" }}>
            {isAvailable
              ? "We'll notify you as soon as suitable work matching your skills becomes available."
              : "Turn your availability ON to receive automated work notifications and grab slots."}
          </p>
        </div>
      </div>

      <button
        onClick={toggleAvailability}
        disabled={updating}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          padding: "10px 18px",
          borderRadius: "10px",
          fontWeight: 700,
          fontSize: "0.9rem",
          cursor: updating ? "wait" : "pointer",
          backgroundColor: isAvailable ? "#F1F5F9" : "#38BDF8",
          color: isAvailable ? "#475569" : "#0F172A",
          border: isAvailable ? "1px solid #CBD5E1" : "none",
          boxShadow: isAvailable ? "none" : "0 4px 12px rgba(56, 189, 248, 0.35)",
          transition: "all 0.2s ease",
        }}
      >
        <Power size={16} />
        {isAvailable ? "Set as Unavailable" : "Go Available Now"}
      </button>
    </div>
  );
};
