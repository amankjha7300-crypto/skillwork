"use client";

import React, { useState } from "react";
import { ArrowRight, CheckCircle2, AlertTriangle, Lock } from "lucide-react";

interface GrabWorkButtonProps {
  taskId: number;
  availableSlots: number;
  isEligible?: boolean;
  eligibilityReason?: string;
  onGrab: (taskId: number) => Promise<{ success: boolean; error?: string }>;
  onSuccess?: () => void;
  size?: "md" | "lg";
}

export const GrabWorkButton: React.FC<GrabWorkButtonProps> = ({
  taskId,
  availableSlots,
  isEligible = true,
  eligibilityReason,
  onGrab,
  onSuccess,
  size = "md",
}) => {
  const [status, setStatus] = useState<"idle" | "grabbing" | "success" | "conflict">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isEligible || availableSlots <= 0 || status === "grabbing" || status === "success") return;

    setStatus("grabbing");
    setErrorMessage(null);

    const result = await onGrab(taskId);

    if (result.success) {
      setStatus("success");
      if (onSuccess) onSuccess();
    } else {
      if (result.error && (result.error.includes("already been assigned") || result.error.includes("no longer available"))) {
        setStatus("conflict");
      } else {
        setStatus("idle");
        setErrorMessage(result.error || "Failed to grab work.");
      }
    }
  };

  const isSlotsEmpty = availableSlots <= 0 || status === "conflict";

  const padding = size === "lg" ? "14px 28px" : "10px 20px";
  const fontSize = size === "lg" ? "1.05rem" : "0.95rem";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <button
        onClick={handleClick}
        disabled={!isEligible || isSlotsEmpty || status === "grabbing" || status === "success"}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          padding,
          fontSize,
          fontWeight: 700,
          borderRadius: "12px",
          border: "none",
          cursor: !isEligible || isSlotsEmpty || status === "success" ? "not-allowed" : "pointer",
          backgroundColor:
            status === "success"
              ? "#16A34A"
              : isSlotsEmpty
              ? "#E2E8F0"
              : !isEligible
              ? "#F1F5F9"
              : "#38BDF8",
          color:
            status === "success"
              ? "#FFFFFF"
              : isSlotsEmpty
              ? "#94A3B8"
              : !isEligible
              ? "#64748B"
              : "#0F172A",
          boxShadow:
            status === "success"
              ? "0 4px 12px rgba(22, 163, 74, 0.3)"
              : isEligible && !isSlotsEmpty
              ? "0 4px 14px rgba(56, 189, 248, 0.4)"
              : "none",
          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          transform: status === "grabbing" ? "scale(0.98)" : "none",
        }}
      >
        {status === "grabbing" && (
          <>
            <span
              style={{
                width: "16px",
                height: "16px",
                border: "2px solid rgba(15,23,42,0.3)",
                borderTopColor: "#0F172A",
                borderRadius: "50%",
                animation: "spin 0.6s linear infinite",
              }}
            />
            <span>GRABBING WORK...</span>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle2 size={18} color="#FFFFFF" />
            <span>WORK ASSIGNED ✓</span>
          </>
        )}

        {status === "idle" && isSlotsEmpty && (
          <>
            <Lock size={16} />
            <span>SLOT ALREADY TAKEN</span>
          </>
        )}

        {status === "idle" && !isSlotsEmpty && !isEligible && (
          <>
            <AlertTriangle size={16} color="#F59E0B" />
            <span>NOT ELIGIBLE</span>
          </>
        )}

        {status === "idle" && !isSlotsEmpty && isEligible && (
          <>
            <span>GRAB WORK</span>
            <ArrowRight size={18} />
          </>
        )}
      </button>

      {errorMessage && (
        <span style={{ fontSize: "0.78rem", color: "#DC2626", fontWeight: 500 }}>
          {errorMessage}
        </span>
      )}

      {!isEligible && eligibilityReason && (
        <span style={{ fontSize: "0.78rem", color: "#B45309", fontWeight: 500 }}>
          {eligibilityReason}
        </span>
      )}
    </div>
  );
};
