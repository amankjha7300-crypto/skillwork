"use client";

import React from "react";
import Link from "next/link";
import { Zap, Clock, Calendar, CheckCircle2 } from "lucide-react";
import { Task } from "@/types/task";
import { formatINR } from "@/lib/utils";
import { WorkTimer } from "../work/WorkTimer";
import { GrabWorkButton } from "../work/GrabWorkButton";

interface WorkAvailableCardProps {
  task: Task;
  onGrab: (taskId: number) => Promise<{ success: boolean; error?: string }>;
  onSuccess?: () => void;
}

export const WorkAvailableCard: React.FC<WorkAvailableCardProps> = ({
  task,
  onGrab,
  onSuccess,
}) => {
  return (
    <div
      className="pulse-work"
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: "18px",
        border: "2px solid #38BDF8",
        padding: "28px",
        boxShadow: "0 10px 25px -5px rgba(56, 189, 248, 0.2), 0 8px 10px -6px rgba(56, 189, 248, 0.1)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Top Banner Tag */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span
            style={{
              backgroundColor: "#38BDF8",
              color: "#0F172A",
              fontSize: "0.85rem",
              fontWeight: 800,
              padding: "4px 12px",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              letterSpacing: "0.5px",
            }}
          >
            <Zap size={16} fill="#0F172A" />
            WORK AVAILABLE
          </span>
          <span
            style={{
              backgroundColor: "#E0F2FE",
              color: "#0284C7",
              fontSize: "0.8rem",
              fontWeight: 700,
              padding: "4px 10px",
              borderRadius: "6px",
              textTransform: "uppercase",
            }}
          >
            {task.category}
          </span>
        </div>

        <WorkTimer expiresAt={task.expires_at} />
      </div>

      {/* Task Headline */}
      <Link href={`/work/${task.id}`}>
        <h2
          style={{
            fontSize: "1.55rem",
            fontWeight: 800,
            color: "#0F172A",
            marginBottom: "10px",
            lineHeight: 1.3,
            cursor: "pointer",
          }}
        >
          {task.title}
        </h2>
      </Link>

      <p style={{ color: "#475569", fontSize: "0.98rem", lineHeight: 1.5, marginBottom: "20px", maxWidth: "800px" }}>
        {task.description}
      </p>

      {/* Required skills */}
      {task.requirements && task.requirements.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "22px" }}>
          {task.requirements.map((req) => (
            <span
              key={req.id}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                fontSize: "0.82rem",
                backgroundColor: "#F0F9FF",
                border: "1px solid #BAE6FD",
                color: "#0369A1",
                padding: "3px 10px",
                borderRadius: "6px",
                fontWeight: 600,
              }}
            >
              <CheckCircle2 size={13} color="#0284C7" />
              {req.skill?.name} • {req.min_proficiency}%+ ({req.min_level_tier})
            </span>
          ))}
        </div>
      )}

      {/* Stats and Grab Action */}
      <div
        style={{
          borderTop: "1px solid #E0F2FE",
          paddingTop: "20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "18px",
        }}
      >
        <div style={{ display: "flex", gap: "28px", flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: "0.8rem", color: "#64748B", fontWeight: 500 }}>Payment</div>
            <div style={{ fontSize: "1.65rem", fontWeight: 800, color: "#0F172A", marginTop: "2px" }}>
              {formatINR(task.payment_amount)}
            </div>
          </div>

          <div>
            <div style={{ fontSize: "0.8rem", color: "#64748B", fontWeight: 500 }}>Estimated Time</div>
            <div style={{ fontSize: "1rem", fontWeight: 700, color: "#334155", display: "flex", alignItems: "center", gap: "5px", marginTop: "4px" }}>
              <Clock size={16} color="#0284C7" />
              {task.estimated_time}
            </div>
          </div>

          <div>
            <div style={{ fontSize: "0.8rem", color: "#64748B", fontWeight: 500 }}>Deadline</div>
            <div style={{ fontSize: "1rem", fontWeight: 700, color: "#334155", display: "flex", alignItems: "center", gap: "5px", marginTop: "4px" }}>
              <Calendar size={16} color="#0284C7" />
              {task.deadline_hours} hours
            </div>
          </div>

          <div>
            <div style={{ fontSize: "0.8rem", color: "#64748B", fontWeight: 500 }}>Available Slots</div>
            <div style={{ fontSize: "1rem", fontWeight: 700, color: "#16A34A", marginTop: "4px" }}>
              {task.available_slots} slot
            </div>
          </div>
        </div>

        {/* Primary CTA */}
        <GrabWorkButton
          taskId={task.id}
          availableSlots={task.available_slots}
          isEligible={task.is_eligible ?? true}
          eligibilityReason={task.eligibility_reason}
          onGrab={onGrab}
          onSuccess={onSuccess}
          size="lg"
        />
      </div>
    </div>
  );
};
