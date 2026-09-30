"use client";

import React from "react";
import Link from "next/link";
import { Clock, Calendar, ArrowRight, Play } from "lucide-react";
import { TaskAssignment } from "@/types/task";
import { formatINR, formatDate } from "@/lib/utils";
import { TaskStatus } from "./TaskStatus";
import { Button } from "../common/Button";

export const TaskCard: React.FC<{ assignment: TaskAssignment; onStart?: (id: number) => void }> = ({
  assignment,
  onStart,
}) => {
  const task = assignment.task;
  const isAssigned = assignment.status === "ASSIGNED";
  const isInProgress = assignment.status === "IN_PROGRESS";

  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: "16px",
        border: "1px solid #E2E8F0",
        padding: "22px",
        boxShadow: "0 2px 4px rgba(15, 23, 42, 0.04)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: "16px",
      }}
    >
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
          <span
            style={{
              fontSize: "0.78rem",
              fontWeight: 700,
              color: "#0284C7",
              backgroundColor: "#E0F2FE",
              padding: "2px 8px",
              borderRadius: "4px",
              textTransform: "uppercase",
            }}
          >
            {task?.category || "Development"}
          </span>
          <TaskStatus status={assignment.status} />
        </div>

        <Link href={`/tasks/${assignment.id}`}>
          <h3
            style={{
              fontSize: "1.2rem",
              fontWeight: 800,
              color: "#0F172A",
              marginBottom: "6px",
              lineHeight: 1.35,
              cursor: "pointer",
            }}
          >
            {task?.title || "Assigned Task"}
          </h3>
        </Link>

        <p style={{ color: "#64748B", fontSize: "0.88rem", lineHeight: 1.5, marginBottom: "14px" }}>
          {task?.description?.slice(0, 110)}...
        </p>
      </div>

      <div
        style={{
          borderTop: "1px solid #F1F5F9",
          paddingTop: "14px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div style={{ display: "flex", gap: "16px" }}>
          <div>
            <div style={{ fontSize: "0.72rem", color: "#64748B" }}>Payment</div>
            <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "#0F172A" }}>
              {formatINR(task?.payment_amount || 0)}
            </div>
          </div>
          <div>
            <div style={{ fontSize: "0.72rem", color: "#64748B" }}>Due Date</div>
            <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#334155", marginTop: "3px", display: "flex", alignItems: "center", gap: "4px" }}>
              <Calendar size={13} color="#64748B" />
              {formatDate(assignment.due_at || assignment.assigned_at)}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "8px" }}>
          {isAssigned && onStart && (
            <Button
              variant="primary"
              size="sm"
              icon={<Play size={14} fill="#0F172A" />}
              onClick={() => onStart(assignment.id)}
            >
              Start Work
            </Button>
          )}

          <Link href={`/tasks/${assignment.id}`}>
            <Button
              variant={isInProgress ? "primary" : "outline"}
              size="sm"
              icon={<ArrowRight size={14} />}
            >
              {isInProgress ? "Continue Task" : "View Workspace"}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
