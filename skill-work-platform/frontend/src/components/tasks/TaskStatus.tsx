import React from "react";
import { Clock, Play, Send, CheckCircle2, AlertCircle, XCircle } from "lucide-react";

export const TaskStatus: React.FC<{ status: string }> = ({ status }) => {
  const norm = (status || "ASSIGNED").toUpperCase();

  const configs: Record<string, { label: string; bg: string; color: string; border: string; icon: React.ReactNode }> = {
    ASSIGNED: {
      label: "Assigned",
      bg: "#E0F2FE",
      color: "#0284C7",
      border: "#BAE6FD",
      icon: <Clock size={13} />,
    },
    IN_PROGRESS: {
      label: "In Progress",
      bg: "#FEF3C7",
      color: "#B45309",
      border: "#FDE68A",
      icon: <Play size={13} />,
    },
    SUBMITTED: {
      label: "Submitted",
      bg: "#EDE9FE",
      color: "#6D28D9",
      border: "#DDD6FE",
      icon: <Send size={13} />,
    },
    UNDER_REVIEW: {
      label: "Under Review",
      bg: "#EDE9FE",
      color: "#6D28D9",
      border: "#DDD6FE",
      icon: <Clock size={13} />,
    },
    NEEDS_CHANGES: {
      label: "Needs Changes",
      bg: "#FEE2E2",
      color: "#DC2626",
      border: "#FECACA",
      icon: <AlertCircle size={13} />,
    },
    APPROVED: {
      label: "Approved & Paid",
      bg: "#DCFCE7",
      color: "#16A34A",
      border: "#BBF7D0",
      icon: <CheckCircle2 size={13} />,
    },
    COMPLETED: {
      label: "Completed",
      bg: "#DCFCE7",
      color: "#16A34A",
      border: "#BBF7D0",
      icon: <CheckCircle2 size={13} />,
    },
    CANCELLED: {
      label: "Cancelled",
      bg: "#F1F5F9",
      color: "#64748B",
      border: "#E2E8F0",
      icon: <XCircle size={13} />,
    },
  };

  const c = configs[norm] || configs.ASSIGNED;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        padding: "3px 10px",
        borderRadius: "9999px",
        fontSize: "0.78rem",
        fontWeight: 700,
        backgroundColor: c.bg,
        color: c.color,
        border: `1px solid ${c.border}`,
      }}
    >
      {c.icon}
      {c.label}
    </span>
  );
};
