"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { TrendingUp, ArrowRight, Zap, Award, BookOpen, Code2, Target } from "lucide-react";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/layout/PageHeader";
import { ProgressBar } from "@/components/common/ProgressBar";
import { Button } from "@/components/common/Button";
import { LoadingState } from "@/components/common/LoadingState";
import { WorkerSkill, SkillRecommendation } from "@/types/skill";

export default function ImproveSkillsPage() {
  const [workerSkills, setWorkerSkills] = useState<WorkerSkill[]>([]);
  const [recommendations, setRecommendations] = useState<SkillRecommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getWorkerSkills().then(setWorkerSkills).catch(console.error),
      api.getRecommendations().then(setRecommendations).catch(console.error),
    ]).finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
      <PageHeader
        title="Improve Your Skills"
        subtitle="Connect learning directly to earning. Upgrading verified skills unlocks higher-value task allocations."
      />

      {loading ? (
        <LoadingState message="Loading skill progress & opportunities..." />
      ) : (
        <>
          {/* Current Skills Section */}
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "16px",
              border: "1px solid #E2E8F0",
              padding: "24px",
              boxShadow: "0 2px 4px rgba(15, 23, 42, 0.04)",
            }}
          >
            <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#0F172A", marginBottom: "16px" }}>
              Current Skills Competency
            </h3>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px" }}>
              {workerSkills.map((ws) => (
                <div key={ws.id} style={{ padding: "14px", borderRadius: "10px", backgroundColor: "#F8FCFF", border: "1px solid #E2E8F0" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <span style={{ fontWeight: 700, color: "#0F172A", fontSize: "0.95rem" }}>{ws.skill.name}</span>
                    <span style={{ fontWeight: 800, color: "#0284C7", fontSize: "0.95rem" }}>{ws.proficiency_percentage}%</span>
                  </div>
                  <ProgressBar progress={ws.proficiency_percentage} color="#38BDF8" height={6} />
                  <div style={{ fontSize: "0.75rem", color: "#64748B", marginTop: "6px" }}>
                    Level: {ws.level_tier} {ws.is_verified ? "• Verified ✓" : ""}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Targeted Earning Unlocks */}
          <div>
            <div style={{ marginBottom: "16px" }}>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#0F172A" }}>
                Targeted Opportunity Unlocks
              </h3>
              <p style={{ color: "#64748B", fontSize: "0.9rem" }}>
                Specific upgrades that directly increase your eligibility for active tasks.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>
              {[
                {
                  skill: "PostgreSQL",
                  headline: "Improve PostgreSQL to unlock more backend database tasks.",
                  increase: "+₹500 more per task",
                  roadmap: "Query Optimization & Indexing",
                  taskType: "High-concurrency PostgreSQL tasks (₹1,400+)",
                  skillId: 3,
                },
                {
                  skill: "FastAPI",
                  headline: "Master async background workers to qualify for Tier 1 APIs.",
                  increase: "+₹350 more per task",
                  roadmap: "Pydantic V2 & Async Engine",
                  taskType: "Microservices & Distributed jobs (₹1,200+)",
                  skillId: 2,
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "16px",
                    border: "1px solid #E2E8F0",
                    padding: "24px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    gap: "16px",
                  }}
                >
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                      <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#0284C7", backgroundColor: "#E0F2FE", padding: "2px 8px", borderRadius: "4px" }}>
                        {item.skill}
                      </span>
                      <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#16A34A", display: "flex", alignItems: "center", gap: "4px" }}>
                        <TrendingUp size={14} /> {item.increase}
                      </span>
                    </div>

                    <h4 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#0F172A", marginBottom: "8px" }}>
                      {item.headline}
                    </h4>

                    <div style={{ backgroundColor: "#F8FCFF", borderRadius: "8px", padding: "12px", border: "1px solid #F1F5F9", fontSize: "0.85rem", color: "#475569" }}>
                      <div>🎯 <strong>Unlocks:</strong> {item.taskType}</div>
                      <div style={{ marginTop: "4px" }}>📚 <strong>Focus:</strong> {item.roadmap}</div>
                    </div>
                  </div>

                  <Link href={`/skills/assessments?skill=${item.skillId}`}>
                    <Button variant="primary" size="sm" icon={<ArrowRight size={14} />} style={{ width: "100%" }}>
                      Take Assessment & Unlock Work
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
