"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/layout/PageHeader";
import { AssessmentCard } from "@/components/skills/AssessmentCard";
import { LoadingState } from "@/components/common/LoadingState";
import { SkillAssessment } from "@/types/skill";

function AssessmentContent() {
  const searchParams = useSearchParams();
  const skillParam = searchParams.get("skill");

  const [assessment, setAssessment] = useState<SkillAssessment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const skillId = skillParam ? Number(skillParam) : 1;
    api.getAssessment(skillId)
      .then(setAssessment)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [skillParam]);

  const handleSubmit = async (answers: number[]) => {
    if (!assessment) throw new Error("No active assessment");
    return await api.submitAssessment({
      assessment_id: assessment.id,
      answers,
    });
  };

  if (loading) return <LoadingState message="Loading skill assessment questions..." />;

  if (!assessment) {
    return (
      <div style={{ textAlign: "center", padding: "40px", backgroundColor: "#FFFFFF", borderRadius: "16px", border: "1px solid #E2E8F0" }}>
        <p style={{ color: "#64748B" }}>No assessment found for this skill.</p>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#FFFFFF", borderRadius: "20px", border: "1px solid #E2E8F0", padding: "32px", boxShadow: "0 4px 12px rgba(15, 23, 42, 0.04)" }}>
      <AssessmentCard
        assessment={assessment}
        onSubmit={handleSubmit}
        onClose={() => {
          window.location.href = "/skills";
        }}
      />
    </div>
  );
}

export default function SkillAssessmentsPage() {
  return (
    <div style={{ maxWidth: "720px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <Link
          href="/skills"
          style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "0.9rem", fontWeight: 700, color: "#0284C7" }}
        >
          <ArrowLeft size={16} /> Back to Skills
        </Link>
      </div>

      <PageHeader
        title="Skill Verification Assessment"
        subtitle="Complete this objective test to verify competence and qualify for premium work allocations."
      />

      <Suspense fallback={<LoadingState message="Loading assessment..." />}>
        <AssessmentContent />
      </Suspense>
    </div>
  );
}
