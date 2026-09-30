"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar, CheckCircle2, Play, FileText, Send } from "lucide-react";
import { api } from "@/lib/api";
import { TaskAssignment } from "@/types/task";
import { formatINR, formatDate } from "@/lib/utils";
import { TaskTimeline } from "@/components/tasks/TaskTimeline";
import { TaskStatus } from "@/components/tasks/TaskStatus";
import { SubmissionForm } from "@/components/tasks/SubmissionForm";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { Button } from "@/components/common/Button";

export default function TaskWorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const assignmentId = Number(params?.id);

  const [assignment, setAssignment] = useState<TaskAssignment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAssignment = async () => {
    if (!assignmentId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await api.getTaskAssignment(assignmentId);
      setAssignment(data);
    } catch (err: any) {
      setError(err.message || "Failed to load task assignment.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignment();
  }, [assignmentId]);

  const handleStartWork = async () => {
    if (!assignmentId) return;
    try {
      const updated = await api.startTask(assignmentId);
      setAssignment(updated);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitDeliverable = async (notes: string, files: any[]) => {
    if (!assignmentId) return false;
    try {
      await api.submitTask(assignmentId, { submission_notes: notes, files });
      await fetchAssignment();
      return true;
    } catch (err: any) {
      alert(err.message || "Failed to submit deliverables.");
      return false;
    }
  };

  if (loading) return <LoadingState message="Loading task workspace..." />;
  if (error || !assignment) return <ErrorState message={error || "Task not found."} onRetry={fetchAssignment} />;

  const task = assignment.task;
  const isAssigned = assignment.status === "ASSIGNED";
  const isInProgress = assignment.status === "IN_PROGRESS";
  const isSubmittedOrDone = ["SUBMITTED", "UNDER_REVIEW", "APPROVED", "COMPLETED"].includes(assignment.status);

  return (
    <div style={{ maxWidth: "960px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}>
      <div>
        <Link
          href="/tasks"
          style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "0.9rem", fontWeight: 700, color: "#0284C7", marginBottom: "16px" }}
        >
          <ArrowLeft size={16} /> Back to My Tasks
        </Link>
      </div>

      {/* Workspace Banner */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "16px",
          border: "1px solid #E2E8F0",
          padding: "28px",
          boxShadow: "0 2px 8px rgba(15, 23, 42, 0.04)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px", marginBottom: "16px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
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
                {task?.category || "Development"}
              </span>
              <TaskStatus status={assignment.status} />
            </div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#0F172A", lineHeight: 1.3 }}>
              {task?.title}
            </h1>
          </div>

          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "0.8rem", color: "#64748B", fontWeight: 500 }}>Payment on Approval</div>
            <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#0F172A", marginTop: "2px" }}>
              {formatINR(task?.payment_amount || 0)}
            </div>
          </div>
        </div>

        {/* 6-Stage Lifecycle Timeline */}
        <div style={{ borderTop: "1px solid #F1F5F9", paddingTop: "20px", marginTop: "16px" }}>
          <TaskTimeline currentStatus={assignment.status} />
        </div>
      </div>

      {/* Task Details & Submission Workspace */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px" }}>
        {/* Left Column: Requirements & Instructions */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ backgroundColor: "#FFFFFF", borderRadius: "16px", border: "1px solid #E2E8F0", padding: "24px" }}>
            <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#0F172A", marginBottom: "12px" }}>
              Description & Requirements
            </h3>
            <p style={{ color: "#475569", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "18px" }}>
              {task?.description}
            </p>

            <div style={{ borderTop: "1px solid #F1F5F9", paddingTop: "14px" }}>
              <h4 style={{ fontSize: "0.9rem", fontWeight: 700, color: "#0F172A", marginBottom: "8px" }}>
                Specific Instructions:
              </h4>
              <p style={{ color: "#475569", fontSize: "0.88rem", lineHeight: 1.5, whiteSpace: "pre-wrap" }}>
                {task?.instructions || "Ensure high test coverage, idiomatic modular patterns, and clear documentation."}
              </p>
            </div>
          </div>

          {/* Action to Start Work if Assigned */}
          {isAssigned && (
            <div style={{ backgroundColor: "#F0F9FF", borderRadius: "16px", border: "1px solid #BAE6FD", padding: "20px", textAlign: "center" }}>
              <h4 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#0284C7", marginBottom: "6px" }}>
                Ready to begin?
              </h4>
              <p style={{ fontSize: "0.88rem", color: "#475569", marginBottom: "14px" }}>
                Marking this task as &ldquo;In Progress&rdquo; begins your execution timer.
              </p>
              <Button variant="primary" size="md" onClick={handleStartWork} icon={<Play size={16} fill="#0F172A" />}>
                Start Work Now
              </Button>
            </div>
          )}
        </div>

        {/* Right Column: Submission Form Workspace */}
        <div>
          {isSubmittedOrDone ? (
            <div style={{ backgroundColor: "#FFFFFF", borderRadius: "16px", border: "1px solid #E2E8F0", padding: "28px", textAlign: "center" }}>
              <CheckCircle2 size={44} color="#16A34A" style={{ margin: "0 auto 12px" }} />
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#0F172A", marginBottom: "6px" }}>
                {assignment.status === "COMPLETED" || assignment.status === "APPROVED"
                  ? "Task Approved & Completed!"
                  : "Deliverable Under Review"}
              </h3>
              <p style={{ color: "#64748B", fontSize: "0.9rem", lineHeight: 1.5 }}>
                {assignment.status === "COMPLETED" || assignment.status === "APPROVED"
                  ? `Payment of ${formatINR(task?.payment_amount || 0)} has been processed and credited to your available balance.`
                  : "Your submission has been received. Reviewers typically approve within 2 to 4 hours."}
              </p>
            </div>
          ) : (
            <SubmissionForm
              assignmentId={assignment.id}
              onSubmit={handleSubmitDeliverable}
            />
          )}
        </div>
      </div>
    </div>
  );
}
