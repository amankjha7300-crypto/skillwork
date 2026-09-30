"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Zap, TrendingUp, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useTasks } from "@/hooks/useTasks";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/layout/PageHeader";
import { AvailabilityCard } from "@/components/dashboard/AvailabilityCard";
import { WorkAvailableCard } from "@/components/dashboard/WorkAvailableCard";
import { DailyLimitCard } from "@/components/dashboard/DailyLimitCard";
import { EarningsCard } from "@/components/dashboard/EarningsCard";
import { PerformanceCard } from "@/components/dashboard/PerformanceCard";
import { ImprovementCard } from "@/components/skills/ImprovementCard";
import { EmptyState } from "@/components/common/EmptyState";
import { LoadingState } from "@/components/common/LoadingState";
import { Task } from "@/types/task";
import { EarningsSummary } from "@/types/earnings";
import { SkillRecommendation } from "@/types/skill";

export default function DashboardPage() {
  const { user, profile } = useAuth();
  const { availableWork, myTasks, loading: tasksLoading, grabWork, fetchWorkAndTasks } = useTasks();

  const [earningsSummary, setEarningsSummary] = useState<EarningsSummary | null>(null);
  const [recommendations, setRecommendations] = useState<SkillRecommendation[]>([]);
  const [loadingDashboard, setLoadingDashboard] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getEarnings().then(setEarningsSummary).catch(console.error),
      api.getRecommendations().then(setRecommendations).catch(console.error),
    ]).finally(() => setLoadingDashboard(false));
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const name = user?.full_name?.split(" ")[0] || "Aman";

  // Find the primary available task (e.g. 1 slot available and worker is eligible)
  const primaryTask: Task | undefined = availableWork.find(
    (t) => t.status === "AVAILABLE" && t.available_slots > 0
  );

  const completedToday = profile?.today_tasks_count ?? 1;
  const dailyLimit = profile?.daily_task_limit ?? 2;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
      {/* Welcome Banner Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#0F172A", letterSpacing: "-0.6px" }}>
            {getGreeting()}, {name} 👋
          </h1>
          <p style={{ color: "#64748B", fontSize: "1.05rem", marginTop: "4px" }}>
            Your skills are ready. We&apos;ll bring suitable work to you.
          </p>
        </div>

        {profile?.is_verified_badge && (
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 14px",
              borderRadius: "9999px",
              backgroundColor: "#E0F2FE",
              border: "1px solid #BAE6FD",
              color: "#0284C7",
              fontSize: "0.85rem",
              fontWeight: 700,
            }}
          >
            <ShieldCheck size={16} />
            Verified Worker ✓
          </div>
        )}
      </div>

      {/* 1. Am I Available? Availability Switch Card */}
      <AvailabilityCard profile={profile} />

      {/* 2. Is Work Available? Primary Focal Work Available Card */}
      {primaryTask ? (
        <section>
          <WorkAvailableCard
            task={primaryTask}
            onGrab={grabWork}
            onSuccess={() => {
              fetchWorkAndTasks();
            }}
          />
        </section>
      ) : (
        <section>
          <EmptyState
            icon={<Zap size={28} />}
            title="No suitable work is available right now."
            description="Use this time to improve your skills and increase your eligibility for future high-paying tasks."
            actionText="Improve Skills"
            actionHref="/skills/improve"
          />
        </section>
      )}

      {/* 3. Middle Metrics Grid: Daily Limit + Earnings + Performance */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
        <DailyLimitCard completedToday={completedToday} dailyLimit={dailyLimit} />
        <EarningsCard earnings={earningsSummary} />
        <PerformanceCard performance={profile?.performance || null} level={profile?.level} />
      </div>

      {/* 4. Connected Learning to Earning Recommendation Section */}
      {recommendations.length > 0 && (
        <section>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
            <div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#0F172A" }}>
                Targeted Skill Recommendations
              </h3>
              <p style={{ color: "#64748B", fontSize: "0.88rem" }}>
                Passing higher assessments unlocks higher-paying task allocations.
              </p>
            </div>
            <Link
              href="/skills/improve"
              style={{ fontSize: "0.85rem", fontWeight: 700, color: "#0284C7", display: "flex", alignItems: "center", gap: "4px" }}
            >
              View All <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "16px" }}>
            {recommendations.slice(0, 2).map((rec) => (
              <ImprovementCard key={rec.skill_id} recommendation={rec} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
