"use client";

import React from "react";
import Link from "next/link";
import { TrendingUp, ArrowRight, Zap, Award } from "lucide-react";
import { SkillRecommendation } from "@/types/skill";
import { Button } from "../common/Button";

export const ImprovementCard: React.FC<{
  recommendation: SkillRecommendation;
  onTakeTest?: (skillId: number) => void;
}> = ({ recommendation, onTakeTest }) => {
  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: "16px",
        border: "1px solid #E2E8F0",
        padding: "24px",
        boxShadow: "0 2px 4px rgba(15, 23, 42, 0.04)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: "18px",
      }}
    >
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <span
            style={{
              backgroundColor: "#E0F2FE",
              color: "#0284C7",
              fontSize: "0.78rem",
              fontWeight: 700,
              padding: "3px 10px",
              borderRadius: "6px",
            }}
          >
            {recommendation.skill_name}
          </span>
          <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#16A34A", display: "flex", alignItems: "center", gap: "4px" }}>
            <TrendingUp size={14} />
            {recommendation.potential_earnings}
          </span>
        </div>

        <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#0F172A", marginBottom: "8px", lineHeight: 1.35 }}>
          {recommendation.headline}
        </h3>

        {/* Learning -> Earning flow */}
        <div
          style={{
            backgroundColor: "#F8FCFF",
            borderRadius: "10px",
            padding: "12px 16px",
            border: "1px solid #E2E8F0",
            fontSize: "0.85rem",
            color: "#475569",
            display: "flex",
            flexDirection: "column",
            gap: "6px",
            marginBottom: "16px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#38BDF8" }} />
            <span>Current: <strong>{recommendation.current_proficiency}% ({recommendation.current_tier})</strong></span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#16A34A" }} />
            <span>Target: <strong>80%+ ({recommendation.target_tier})</strong> to unlock premium allocations</span>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        {onTakeTest ? (
          <Button
            variant="primary"
            size="sm"
            onClick={() => onTakeTest(recommendation.skill_id)}
            icon={<Award size={14} />}
          >
            Take Skill Assessment
          </Button>
        ) : (
          <Link href={`/skills/assessments?skill=${recommendation.skill_id}`}>
            <Button variant="primary" size="sm" icon={<ArrowRight size={14} />}>
              Start Practice & Test
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};
