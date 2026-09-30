"use client";

import React from "react";
import Link from "next/link";
import { Zap, ArrowRight } from "lucide-react";
import { formatINR } from "@/lib/utils";
import { Button } from "../common/Button";

interface WorkNotificationProps {
  taskId: number;
  title: string;
  category: string;
  reward: number;
  slots: number;
  onGrab?: (taskId: number) => void;
}

export const WorkNotification: React.FC<WorkNotificationProps> = ({
  taskId,
  title,
  category,
  reward,
  slots,
  onGrab,
}) => {
  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: "14px",
        border: "2px solid #38BDF8",
        padding: "18px 20px",
        boxShadow: "0 4px 12px rgba(56, 189, 248, 0.15)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "16px",
        flexWrap: "wrap",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "10px",
            backgroundColor: "#38BDF8",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#0F172A",
            flexShrink: 0,
          }}
        >
          <Zap size={20} fill="#0F172A" />
        </div>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "2px" }}>
            <span style={{ fontSize: "0.82rem", fontWeight: 800, color: "#0284C7", textTransform: "uppercase" }}>
              ⚡ New Work Available
            </span>
            <span style={{ fontSize: "0.75rem", color: "#64748B" }}>• {category}</span>
          </div>
          <div style={{ fontSize: "1rem", fontWeight: 700, color: "#0F172A" }}>{title}</div>
          <div style={{ fontSize: "0.85rem", color: "#475569", marginTop: "2px" }}>
            Payment: <strong>{formatINR(reward)}</strong> • {slots} slot available
          </div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <Link href={`/work/${taskId}`}>
          <Button variant="outline" size="sm">
            View Details
          </Button>
        </Link>
        {onGrab ? (
          <Button variant="primary" size="sm" onClick={() => onGrab(taskId)} icon={<ArrowRight size={14} />}>
            Grab Work
          </Button>
        ) : (
          <Link href={`/work/${taskId}`}>
            <Button variant="primary" size="sm" icon={<ArrowRight size={14} />}>
              Grab Work
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};
