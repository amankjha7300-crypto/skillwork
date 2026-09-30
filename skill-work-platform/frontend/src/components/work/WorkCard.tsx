"use client";

import React from "react";
import Link from "next/link";
import { Clock, Calendar, CheckCircle2 } from "lucide-react";
import { Task } from "@/types/task";
import { formatINR } from "@/lib/utils";
import { WorkTimer } from "./WorkTimer";
import { GrabWorkButton } from "./GrabWorkButton";

interface WorkCardProps {
  task: Task;
  onGrab: (taskId: number) => Promise<{ success: boolean; error?: string }>;
  onSuccess?: () => void;
  featured?: boolean;
}

export const WorkCard: React.FC<WorkCardProps> = ({
  task,
  onGrab,
  onSuccess,
  featured = false,
}) => {
  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: "16px",
        border: featured ? "2px solid #38BDF8" : "1px solid #E2E8F0",
        padding: "24px",
        boxShadow: featured ? "0 8px 24px rgba(56, 189, 248, 0.15)" : "0 2px 4px rgba(15, 23, 42, 0.04)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: "18px",
        transition: "all 0.2s ease",
        position: "relative",
      }}
    >
      {/* Top Header */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px", gap: "12px", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
              style={{
                backgroundColor: "#E0F2FE",
                color: "#0284C7",
                fontSize: "0.78rem",
                fontWeight: 700,
                padding: "3px 10px",
                borderRadius: "6px",
                textTransform: "uppercase",
              }}
            >
              {task.category}
            </span>
            {featured && (
              <span
                style={{
                  backgroundColor: "#FEF3C7",
                  color: "#B45309",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  padding: "3px 8px",
                  borderRadius: "6px",
                }}
              >
                ⚡ Priority Work
              </span>
            )}
          </div>
          <WorkTimer expiresAt={task.expires_at} />
        </div>

        <Link href={`/work/${task.id}`}>
          <h3
            style={{
              fontSize: "1.25rem",
              fontWeight: 800,
              color: "#0F172A",
              marginBottom: "8px",
              lineHeight: 1.35,
              cursor: "pointer",
            }}
          >
            {task.title}
          </h3>
        </Link>

        <p style={{ color: "#64748B", fontSize: "0.92rem", lineHeight: 1.5, marginBottom: "16px" }}>
          {task.description}
        </p>

        {/* Skill badges */}
        {task.requirements && task.requirements.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "16px" }}>
            {task.requirements.map((req) => (
              <span
                key={req.id}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  fontSize: "0.78rem",
                  backgroundColor: "#F8FCFF",
                  border: "1px solid #E2E8F0",
                  color: "#334155",
                  padding: "2px 8px",
                  borderRadius: "6px",
                  fontWeight: 500,
                }}
              >
                <CheckCircle2 size={12} color="#0284C7" />
                {req.skill?.name || "Skill"} ({req.min_proficiency}%+ / {req.min_level_tier})
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer Info & Grab Action */}
      <div
        style={{
          borderTop: "1px solid #F1F5F9",
          paddingTop: "16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "14px",
        }}
      >
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: "0.75rem", color: "#64748B", fontWeight: 500 }}>Payment</div>
            <div style={{ fontSize: "1.35rem", fontWeight: 800, color: "#0F172A" }}>
              {formatINR(task.payment_amount)}
            </div>
          </div>
          <div>
            <div style={{ fontSize: "0.75rem", color: "#64748B", fontWeight: 500 }}>Estimated Time</div>
            <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "0.9rem", fontWeight: 600, color: "#334155", marginTop: "4px" }}>
              <Clock size={14} color="#64748B" />
              {task.estimated_time}
            </div>
          </div>
          <div>
            <div style={{ fontSize: "0.75rem", color: "#64748B", fontWeight: 500 }}>Deadline</div>
            <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "0.9rem", fontWeight: 600, color: "#334155", marginTop: "4px" }}>
              <Calendar size={14} color="#64748B" />
              {task.deadline_hours} hours
            </div>
          </div>
        </div>

        <GrabWorkButton
          taskId={task.id}
          availableSlots={task.available_slots}
          isEligible={task.is_eligible ?? true}
          eligibilityReason={task.eligibility_reason}
          onGrab={onGrab}
          onSuccess={onSuccess}
          size={featured ? "lg" : "md"}
        />
      </div>
    </div>
  );
};
