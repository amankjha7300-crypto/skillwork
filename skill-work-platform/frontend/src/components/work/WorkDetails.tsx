"use client";

import React from "react";
import { Clock, Calendar, CheckCircle2, ShieldAlert, FileText, Check, ArrowRight } from "lucide-react";
import { Task } from "@/types/task";
import { formatINR } from "@/lib/utils";
import { WorkTimer } from "./WorkTimer";
import { GrabWorkButton } from "./GrabWorkButton";

interface WorkDetailsProps {
  task: Task;
  onGrab: (taskId: number) => Promise<{ success: boolean; error?: string }>;
  onSuccess?: () => void;
}

export const WorkDetails: React.FC<WorkDetailsProps> = ({
  task,
  onGrab,
  onSuccess,
}) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Top Banner Card */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "16px",
          border: "1px solid #E2E8F0",
          padding: "32px",
          boxShadow: "0 4px 12px rgba(15, 23, 42, 0.05)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px", flexWrap: "wrap", marginBottom: "16px" }}>
          <div>
            <span
              style={{
                backgroundColor: "#E0F2FE",
                color: "#0284C7",
                fontSize: "0.8rem",
                fontWeight: 700,
                padding: "4px 12px",
                borderRadius: "6px",
                textTransform: "uppercase",
              }}
            >
              {task.category}
            </span>
            <h1 style={{ fontSize: "1.85rem", fontWeight: 800, color: "#0F172A", marginTop: "12px", lineHeight: 1.25 }}>
              {task.title}
            </h1>
          </div>
          <WorkTimer expiresAt={task.expires_at} />
        </div>

        <p style={{ color: "#475569", fontSize: "1.05rem", lineHeight: 1.6, marginBottom: "24px" }}>
          {task.description}
        </p>

        {/* Stats Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: "16px",
            backgroundColor: "#F8FCFF",
            padding: "20px",
            borderRadius: "12px",
            border: "1px solid #E2E8F0",
            marginBottom: "24px",
          }}
        >
          <div>
            <div style={{ fontSize: "0.8rem", color: "#64748B", fontWeight: 500 }}>Payment</div>
            <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#0F172A", marginTop: "2px" }}>
              {formatINR(task.payment_amount)}
            </div>
          </div>
          <div>
            <div style={{ fontSize: "0.8rem", color: "#64748B", fontWeight: 500 }}>Estimated Time</div>
            <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#0F172A", marginTop: "4px", display: "flex", alignItems: "center", gap: "6px" }}>
              <Clock size={16} color="#0284C7" />
              {task.estimated_time}
            </div>
          </div>
          <div>
            <div style={{ fontSize: "0.8rem", color: "#64748B", fontWeight: 500 }}>Deadline</div>
            <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#0F172A", marginTop: "4px", display: "flex", alignItems: "center", gap: "6px" }}>
              <Calendar size={16} color="#0284C7" />
              {task.deadline_hours} Hours
            </div>
          </div>
          <div>
            <div style={{ fontSize: "0.8rem", color: "#64748B", fontWeight: 500 }}>Available Slots</div>
            <div style={{ fontSize: "1.1rem", fontWeight: 700, color: task.available_slots > 0 ? "#16A34A" : "#EF4444", marginTop: "4px" }}>
              {task.available_slots} / {task.total_slots} slot
            </div>
          </div>
        </div>

        {/* Action bar */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
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

      {/* Instructions & Deliverables */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px" }}>
        {/* Instructions */}
        <div
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "16px",
            border: "1px solid #E2E8F0",
            padding: "24px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
            <FileText size={20} color="#0284C7" />
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#0F172A" }}>Instructions</h3>
          </div>
          <p style={{ color: "#475569", fontSize: "0.95rem", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
            {task.instructions || "Please implement the complete requirements following modern best practices. Ensure clean code architecture and documented components."}
          </p>
        </div>

        {/* Expected Output */}
        <div
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "16px",
            border: "1px solid #E2E8F0",
            padding: "24px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
            <Check size={20} color="#16A34A" />
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#0F172A" }}>Expected Output</h3>
          </div>
          <p style={{ color: "#475569", fontSize: "0.95rem", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
            {task.expected_output || "A zipped deliverable containing clean source code, configuration files, and documentation demonstrating test completion."}
          </p>
        </div>
      </div>

      {/* Required Skills & Rules */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "16px",
          border: "1px solid #E2E8F0",
          padding: "24px",
        }}
      >
        <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#0F172A", marginBottom: "16px" }}>
          Required Skills & Eligibility
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "12px", marginBottom: "20px" }}>
          {task.requirements?.map((req) => (
            <div
              key={req.id}
              style={{
                padding: "14px",
                borderRadius: "10px",
                backgroundColor: "#F8FCFF",
                border: "1px solid #E2E8F0",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div style={{ fontWeight: 700, color: "#0F172A", fontSize: "0.95rem" }}>
                  {req.skill?.name}
                </div>
                <div style={{ fontSize: "0.8rem", color: "#64748B" }}>
                  Min Level: {req.min_level_tier} ({req.min_proficiency}%+)
                </div>
              </div>
              <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "#0284C7", backgroundColor: "#E0F2FE", padding: "2px 8px", borderRadius: "4px" }}>
                Mandatory
              </span>
            </div>
          ))}
        </div>

        {/* Rules */}
        <div style={{ backgroundColor: "#FEF3C7", padding: "14px 18px", borderRadius: "10px", display: "flex", gap: "12px", alignItems: "flex-start" }}>
          <ShieldAlert size={20} color="#D97706" style={{ flexShrink: 0, marginTop: "2px" }} />
          <div style={{ fontSize: "0.88rem", color: "#92400E", lineHeight: 1.5 }}>
            <strong>Important Rules:</strong> Work must be submitted before the deadline timer. Only one worker can hold this slot. High quality work increases your rating and unlocks higher value tasks.
          </div>
        </div>
      </div>
    </div>
  );
};
