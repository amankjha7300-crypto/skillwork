"use client";

import React from "react";
import Link from "next/link";
import { Zap, CheckCircle2, AlertCircle, Award, Wallet, Bell, ArrowRight } from "lucide-react";
import { AppNotification } from "@/types/notification";
import { formatTimeAgo } from "@/lib/utils";

export const NotificationItem: React.FC<{
  notification: AppNotification;
  onMarkRead: (id: number) => void;
}> = ({ notification, onMarkRead }) => {
  const getIcon = () => {
    switch (notification.type) {
      case "NEW_WORK":
        return <Zap size={18} color="#0284C7" fill="#38BDF8" />;
      case "TASK_APPROVED":
      case "PAYMENT_RECEIVED":
        return <Wallet size={18} color="#16A34A" />;
      case "LEVEL_UPGRADE":
        return <Award size={18} color="#D97706" />;
      default:
        return <Bell size={18} color="#64748B" />;
    }
  };

  return (
    <div
      onClick={() => onMarkRead(notification.id)}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "14px",
        padding: "16px 20px",
        borderRadius: "12px",
        backgroundColor: notification.is_read ? "#FFFFFF" : "#F0F9FF",
        border: `1px solid ${notification.is_read ? "#E2E8F0" : "#BAE6FD"}`,
        transition: "all 0.15s ease",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          width: "36px",
          height: "36px",
          borderRadius: "10px",
          backgroundColor: notification.is_read ? "#F1F5F9" : "#E0F2FE",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {getIcon()}
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
          <h4 style={{ fontSize: "0.95rem", fontWeight: notification.is_read ? 600 : 700, color: "#0F172A" }}>
            {notification.title}
          </h4>
          <span style={{ fontSize: "0.75rem", color: "#64748B" }}>
            {formatTimeAgo(notification.created_at)}
          </span>
        </div>
        <p style={{ color: "#475569", fontSize: "0.88rem", lineHeight: 1.45, marginBottom: notification.action_url ? "8px" : "0" }}>
          {notification.message}
        </p>
        {notification.action_url && (
          <Link
            href={notification.action_url}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              fontSize: "0.82rem",
              fontWeight: 700,
              color: "#0284C7",
            }}
          >
            View Opportunity <ArrowRight size={13} />
          </Link>
        )}
      </div>

      {!notification.is_read && (
        <span
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            backgroundColor: "#38BDF8",
            flexShrink: 0,
            marginTop: "6px",
          }}
        />
      )}
    </div>
  );
};
