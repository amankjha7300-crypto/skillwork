"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle2, Award, ArrowRight } from "lucide-react";
import { WorkerSkill } from "@/types/skill";
import { ProgressBar } from "../common/ProgressBar";
import { Button } from "../common/Button";

export const SkillCard: React.FC<{ workerSkill: WorkerSkill; onTakeAssessment?: (skillId: number) => void }> = ({
  workerSkill,
  onTakeAssessment,
}) => {
  const { skill, proficiency_percentage, level_tier, is_verified } = workerSkill;

  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: "16px",
        border: "1px solid #E2E8F0",
        padding: "20px",
        boxShadow: "0 2px 4px rgba(15, 23, 42, 0.04)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: "14px",
      }}
    >
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <h4 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#0F172A" }}>{skill?.name}</h4>
              {is_verified && (
                <span title="Verified Skill" style={{ display: "flex", alignItems: "center" }}>
                  <CheckCircle2 size={16} color="#0284C7" fill="#E0F2FE" />
                </span>
              )}
            </div>
            <span style={{ fontSize: "0.75rem", color: "#64748B" }}>{skill?.category}</span>
          </div>

          <span
            style={{
              fontSize: "0.75rem",
              fontWeight: 700,
              padding: "2px 8px",
              borderRadius: "6px",
              backgroundColor: is_verified ? "#DCFCE7" : "#FEF3C7",
              color: is_verified ? "#16A34A" : "#B45309",
            }}
          >
            {is_verified ? "Verified ✓" : "Unverified"}
          </span>
        </div>

        {/* Level and percentage */}
        <div style={{ margin: "10px 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "4px" }}>
            <span style={{ fontWeight: 600, color: "#0284C7" }}>{level_tier}</span>
            <span style={{ fontWeight: 700, color: "#0F172A" }}>{proficiency_percentage}%</span>
          </div>
          <ProgressBar progress={proficiency_percentage} color="#38BDF8" height={6} />
        </div>
      </div>

      <div style={{ borderTop: "1px solid #F1F5F9", paddingTop: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "0.75rem", color: "#64748B" }}>
          {is_verified ? "Eligible for tasks" : "Take test to verify"}
        </span>

        {onTakeAssessment && (
          <Button
            variant={is_verified ? "outline" : "primary"}
            size="sm"
            onClick={() => onTakeAssessment(skill.id)}
            icon={<Award size={14} />}
          >
            {is_verified ? "Retake Test" : "Verify Skill"}
          </Button>
        )}
      </div>
    </div>
  );
};
