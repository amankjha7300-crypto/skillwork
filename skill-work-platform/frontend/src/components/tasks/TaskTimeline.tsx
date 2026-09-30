import React from "react";
import { Check } from "lucide-react";

export const TaskTimeline: React.FC<{ currentStatus: string }> = ({ currentStatus }) => {
  const steps = [
    { id: "ASSIGNED", label: "Assigned" },
    { id: "IN_PROGRESS", label: "In Progress" },
    { id: "SUBMITTED", label: "Submitted" },
    { id: "UNDER_REVIEW", label: "Under Review" },
    { id: "APPROVED", label: "Approved" },
    { id: "COMPLETED", label: "Payment Released" },
  ];

  const getStepIndex = (status: string) => {
    const s = (status || "ASSIGNED").toUpperCase();
    if (s === "ASSIGNED") return 0;
    if (s === "IN_PROGRESS") return 1;
    if (s === "SUBMITTED") return 2;
    if (s === "UNDER_REVIEW") return 3;
    if (s === "APPROVED") return 4;
    if (s === "COMPLETED") return 5;
    return 0;
  };

  const currentIndex = getStepIndex(currentStatus);

  return (
    <div style={{ width: "100%", padding: "16px 0", overflowX: "auto" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", minWidth: "520px", position: "relative" }}>
        {/* Background track line */}
        <div
          style={{
            position: "absolute",
            top: "16px",
            left: "20px",
            right: "20px",
            height: "3px",
            backgroundColor: "#E2E8F0",
            zIndex: 1,
          }}
        />
        {/* Progress track line */}
        <div
          style={{
            position: "absolute",
            top: "16px",
            left: "20px",
            width: `${(currentIndex / (steps.length - 1)) * 92}%`,
            height: "3px",
            backgroundColor: "#38BDF8",
            zIndex: 2,
            transition: "width 0.4s ease",
          }}
        />

        {steps.map((step, idx) => {
          const isDone = idx < currentIndex;
          const isCurrent = idx === currentIndex;

          return (
            <div
              key={step.id}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
                position: "relative",
                zIndex: 3,
              }}
            >
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  backgroundColor: isDone || isCurrent ? "#38BDF8" : "#FFFFFF",
                  border: `2px solid ${isDone || isCurrent ? "#0284C7" : "#CBD5E1"}`,
                  color: isDone || isCurrent ? "#0F172A" : "#94A3B8",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  boxShadow: isCurrent ? "0 0 0 4px rgba(56, 189, 248, 0.25)" : "none",
                  transition: "all 0.3s ease",
                }}
              >
                {isDone ? <Check size={16} strokeWidth={3} /> : idx + 1}
              </div>
              <span
                style={{
                  fontSize: "0.78rem",
                  fontWeight: isCurrent ? 700 : 500,
                  color: isCurrent ? "#0284C7" : isDone ? "#0F172A" : "#94A3B8",
                  textAlign: "center",
                }}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
