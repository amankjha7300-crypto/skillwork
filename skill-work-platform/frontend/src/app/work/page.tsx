"use client";

import React from "react";
import Link from "next/link";
import { Zap, Clock, TrendingUp, ShieldCheck } from "lucide-react";
import { useTasks } from "@/hooks/useTasks";
import { useAuth } from "@/hooks/useAuth";
import { PageHeader } from "@/components/layout/PageHeader";
import { WorkCard } from "@/components/work/WorkCard";
import { EmptyState } from "@/components/common/EmptyState";
import { LoadingState } from "@/components/common/LoadingState";
import { AvailabilityCard } from "@/components/dashboard/AvailabilityCard";

export default function WorkPage() {
  const { profile } = useAuth();
  const { availableWork, loading, grabWork, fetchWorkAndTasks } = useTasks();

  const isAvailable = profile?.availability?.is_available ?? true;
  const eligibleWork = availableWork.filter((t) => t.is_eligible !== false);
  const otherWork = availableWork.filter((t) => t.is_eligible === false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <PageHeader
        title="Live Work Allocations"
        subtitle="Tasks automatically routed to you based on your verified skills and availability."
      />

      {/* Availability Status Reminder */}
      <AvailabilityCard profile={profile} />

      {loading ? (
        <LoadingState message="Fetching live work opportunities..." />
      ) : availableWork.length === 0 || !isAvailable ? (
        <EmptyState
          icon={<Zap size={32} />}
          title={!isAvailable ? "You are currently unavailable" : "No suitable work is available right now."}
          description={
            !isAvailable
              ? "Turn on your availability to allow the allocation engine to match you with available tasks."
              : "While you wait for new work to be allocated, improve your skills and pass assessments to unlock higher-tier opportunities."
          }
          actionText={!isAvailable ? undefined : "Improve Skills"}
          actionHref="/skills/improve"
        />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
          {/* Current Eligible Opportunities */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#0F172A" }}>
                Current Opportunities ({eligibleWork.length})
              </h2>
              <span style={{ fontSize: "0.82rem", color: "#16A34A", fontWeight: 700 }}>
                Eligible & Ready to Grab
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "20px" }}>
              {eligibleWork.map((task, idx) => (
                <WorkCard
                  key={task.id}
                  task={task}
                  featured={idx === 0}
                  onGrab={grabWork}
                  onSuccess={fetchWorkAndTasks}
                />
              ))}
            </div>
          </div>

          {/* Upcoming Eligibility (Higher tier tasks that require higher verification) */}
          {otherWork.length > 0 && (
            <div style={{ borderTop: "1px solid #E2E8F0", paddingTop: "24px" }}>
              <div style={{ marginBottom: "14px" }}>
                <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#0F172A" }}>
                  Upcoming Eligibility (Requires Skill Upgrade)
                </h3>
                <p style={{ color: "#64748B", fontSize: "0.88rem" }}>
                  Improve your proficiency score to become eligible for these higher-value opportunities.
                </p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "20px" }}>
                {otherWork.map((task) => (
                  <WorkCard
                    key={task.id}
                    task={task}
                    onGrab={grabWork}
                    onSuccess={fetchWorkAndTasks}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
