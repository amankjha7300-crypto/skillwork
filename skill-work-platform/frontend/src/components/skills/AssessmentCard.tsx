"use client";

import React, { useState } from "react";
import { CheckCircle2, AlertCircle, Award } from "lucide-react";
import { SkillAssessment, AssessmentResult } from "@/types/skill";
import { Button } from "../common/Button";

interface AssessmentCardProps {
  assessment: SkillAssessment;
  onSubmit: (answers: number[]) => Promise<AssessmentResult>;
  onClose: () => void;
}

export const AssessmentCard: React.FC<AssessmentCardProps> = ({
  assessment,
  onSubmit,
  onClose,
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(
    new Array(assessment.questions.length).fill(-1)
  );
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<AssessmentResult | null>(null);

  const handleSelect = (optionIdx: number) => {
    const updated = [...selectedAnswers];
    updated[currentQIndex] = optionIdx;
    setSelectedAnswers(updated);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await onSubmit(selectedAnswers);
      setResult(res);
    } catch (e: any) {
      alert(e.message || "Failed to submit assessment.");
    } finally {
      setSubmitting(false);
    }
  };

  if (result) {
    return (
      <div style={{ textAlign: "center", padding: "16px 0" }}>
        <div
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            backgroundColor: result.passed ? "#DCFCE7" : "#FEF3C7",
            color: result.passed ? "#16A34A" : "#D97706",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
          }}
        >
          {result.passed ? <CheckCircle2 size={36} /> : <AlertCircle size={36} />}
        </div>

        <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#0F172A", marginBottom: "4px" }}>
          {result.passed ? "Skill Verification Complete!" : "Assessment Completed"}
        </h3>
        <p style={{ color: "#64748B", fontSize: "0.9rem", marginBottom: "20px" }}>
          {result.passed
            ? "Your verified skill level has been updated and will unlock matching work opportunities."
            : "Review recommended resources and retry to increase your qualification level."}
        </p>

        {/* Results summary card */}
        <div
          style={{
            backgroundColor: "#F8FCFF",
            borderRadius: "12px",
            border: "1px solid #E2E8F0",
            padding: "20px",
            marginBottom: "24px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "12px",
          }}
        >
          <div>
            <div style={{ fontSize: "0.75rem", color: "#64748B" }}>Score</div>
            <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#0F172A" }}>
              {result.score}/100
            </div>
          </div>
          <div>
            <div style={{ fontSize: "0.75rem", color: "#64748B" }}>Level</div>
            <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "#0284C7" }}>
              {result.achieved_level}
            </div>
          </div>
          <div>
            <div style={{ fontSize: "0.75rem", color: "#64748B" }}>Status</div>
            <div style={{ fontSize: "1rem", fontWeight: 700, color: result.passed ? "#16A34A" : "#D97706", marginTop: "2px" }}>
              {result.passed ? "Verified ✓" : "Review Needed"}
            </div>
          </div>
        </div>

        <Button variant="primary" onClick={onClose} style={{ width: "100%" }}>
          Continue to Dashboard
        </Button>
      </div>
    );
  }

  const q = assessment.questions[currentQIndex];
  const allAnswered = selectedAnswers.every((a) => a !== -1);

  return (
    <div>
      {/* Header Info */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#0284C7" }}>
          Question {currentQIndex + 1} of {assessment.questions.length}
        </span>
        <span style={{ fontSize: "0.8rem", color: "#64748B" }}>
          Passing: {assessment.passing_score}%
        </span>
      </div>

      {/* Question prompt */}
      <div style={{ fontSize: "1.05rem", fontWeight: 700, color: "#0F172A", marginBottom: "16px", lineHeight: 1.4 }}>
        {q.question}
      </div>

      {/* Options */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px" }}>
        {q.options.map((opt, idx) => {
          const isSelected = selectedAnswers[currentQIndex] === idx;

          return (
            <div
              key={idx}
              onClick={() => handleSelect(idx)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px 16px",
                borderRadius: "10px",
                border: `1px solid ${isSelected ? "#38BDF8" : "#E2E8F0"}`,
                backgroundColor: isSelected ? "#F0F9FF" : "#FFFFFF",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  border: `2px solid ${isSelected ? "#0284C7" : "#CBD5E1"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {isSelected && (
                  <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#0284C7" }} />
                )}
              </div>
              <span style={{ fontSize: "0.92rem", color: isSelected ? "#0F172A" : "#334155", fontWeight: isSelected ? 600 : 400 }}>
                {opt}
              </span>
            </div>
          );
        })}
      </div>

      {/* Navigation buttons */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Button
          variant="outline"
          size="sm"
          disabled={currentQIndex === 0}
          onClick={() => setCurrentQIndex((prev) => prev - 1)}
        >
          Previous
        </Button>

        {currentQIndex < assessment.questions.length - 1 ? (
          <Button
            variant="primary"
            size="sm"
            onClick={() => setCurrentQIndex((prev) => prev + 1)}
          >
            Next Question
          </Button>
        ) : (
          <Button
            variant="primary"
            size="sm"
            loading={submitting}
            disabled={!allAnswered}
            onClick={handleSubmit}
            icon={<Award size={16} />}
          >
            Submit Assessment
          </Button>
        )}
      </div>
    </div>
  );
};
