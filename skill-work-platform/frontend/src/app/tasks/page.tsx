"use client";

import React, { useState, useEffect } from "react";
import { CheckSquare, ArrowRight, Play } from "lucide-react";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/layout/PageHeader";
import { TaskCard } from "@/components/tasks/TaskCard";
import { EmptyState } from "@/components/common/EmptyState";
import { LoadingState } from "@/components/common/LoadingState";
import { TaskAssignment } from "@/types/task";

export default function MyTasksPage() {
  const [tasks, setTasks] = useState<TaskAssignment[]>([]);
  const [tab, setTab] = useState<"ACTIVE" | "SUBMITTED" | "COMPLETED" | "ALL">("ACTIVE");
  const [loading, setLoading] = useState(true);

  const fetchTasks = async (statusFilter?: string) => {
    setLoading(true);
    try {
      const data = await api.getMyTasks(statusFilter === "ALL" ? undefined : statusFilter);
      setTasks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks(tab);
  }, [tab]);

  const handleStartTask = async (assignmentId: number) => {
    try {
      await api.startTask(assignmentId);
      await fetchTasks(tab);
    } catch (err) {
      console.error(err);
    }
  };

  const tabs = [
    { id: "ACTIVE", label: "Active" },
    { id: "SUBMITTED", label: "Submitted" },
    { id: "COMPLETED", label: "Completed" },
    { id: "ALL", label: "All Tasks" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <PageHeader
        title="My Tasks"
        subtitle="Track assigned deliverables, workspaces, and reviews."
      />

      {/* Tabs */}
      <div style={{ display: "flex", gap: "8px", borderBottom: "1px solid #E2E8F0", paddingBottom: "12px", overflowX: "auto" }}>
        {tabs.map((t) => {
          const isActive = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id as any)}
              style={{
                padding: "8px 18px",
                borderRadius: "10px",
                fontSize: "0.9rem",
                fontWeight: isActive ? 700 : 500,
                color: isActive ? "#0284C7" : "#64748B",
                backgroundColor: isActive ? "#E0F2FE" : "transparent",
                border: "none",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {loading ? (
        <LoadingState message="Loading your tasks..." />
      ) : tasks.length === 0 ? (
        <EmptyState
          icon={<CheckSquare size={32} />}
          title={`No ${tab.toLowerCase()} tasks found`}
          description="Check live work opportunities to grab suitable tasks that match your skills."
          actionText="View Live Work"
          actionHref="/work"
        />
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "20px" }}>
          {tasks.map((assignment) => (
            <TaskCard
              key={assignment.id}
              assignment={assignment}
              onStart={handleStartTask}
            />
          ))}
        </div>
      )}
    </div>
  );
}
