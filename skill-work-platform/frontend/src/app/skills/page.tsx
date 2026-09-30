"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Award, Plus, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/layout/PageHeader";
import { SkillCard } from "@/components/skills/SkillCard";
import { AssessmentCard } from "@/components/skills/AssessmentCard";
import { LoadingState } from "@/components/common/LoadingState";
import { Modal } from "@/components/common/Modal";
import { Button } from "@/components/common/Button";
import { WorkerSkill, SkillAssessment } from "@/types/skill";

export default function SkillsPage() {
  const [workerSkills, setWorkerSkills] = useState<WorkerSkill[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeAssessment, setActiveAssessment] = useState<SkillAssessment | null>(null);
  const [assessmentModalOpen, setAssessmentModalOpen] = useState(false);

  // Add skill modal state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [allSkills, setAllSkills] = useState<any[]>([]);
  const [selectedSkillId, setSelectedSkillId] = useState<number>(1);
  const [proficiency, setProficiency] = useState<number>(75);

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const [wSkills, aSkills] = await Promise.all([
        api.getWorkerSkills(),
        api.listSkills(),
      ]);
      setWorkerSkills(wSkills);
      setAllSkills(aSkills);
      if (aSkills.length > 0) setSelectedSkillId(aSkills[0].id);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleTakeAssessment = async (skillId: number) => {
    try {
      const assessment = await api.getAssessment(skillId);
      setActiveAssessment(assessment);
      setAssessmentModalOpen(true);
    } catch (err: any) {
      alert(err.message || "No assessment configured for this skill yet.");
    }
  };

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.saveWorkerSkill({
        skill_id: selectedSkillId,
        proficiency_percentage: proficiency,
      });
      setAddModalOpen(false);
      await fetchSkills();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitAssessment = async (answers: number[]) => {
    if (!activeAssessment) throw new Error("No active assessment");
    const res = await api.submitAssessment({
      assessment_id: activeAssessment.id,
      answers,
    });
    await fetchSkills();
    return res;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <PageHeader
        title="Skills & Verification"
        subtitle="The platform allocates tasks based on your verified skills and demonstrated benchmarks."
        actions={
          <div style={{ display: "flex", gap: "10px" }}>
            <Link href="/skills/improve">
              <Button variant="secondary" size="md" icon={<ArrowRight size={16} />}>
                Improve Skills
              </Button>
            </Link>
            <Button
              variant="primary"
              size="md"
              icon={<Plus size={16} />}
              onClick={() => setAddModalOpen(true)}
            >
              Add New Skill
            </Button>
          </div>
        }
      />

      {loading ? (
        <LoadingState message="Loading skills and verification badges..." />
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
          {workerSkills.map((ws) => (
            <SkillCard
              key={ws.id}
              workerSkill={ws}
              onTakeAssessment={handleTakeAssessment}
            />
          ))}
        </div>
      )}

      {/* Assessment Modal */}
      <Modal
        isOpen={assessmentModalOpen}
        onClose={() => setAssessmentModalOpen(false)}
        title={activeAssessment?.title || "Skill Verification Assessment"}
        maxWidth="600px"
      >
        {activeAssessment && (
          <AssessmentCard
            assessment={activeAssessment}
            onSubmit={handleSubmitAssessment}
            onClose={() => setAssessmentModalOpen(false)}
          />
        )}
      </Modal>

      {/* Add Skill Modal */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Add Competency Skill"
      >
        <form onSubmit={handleAddSkill} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#0F172A", marginBottom: "6px" }}>
              Select Skill
            </label>
            <select
              value={selectedSkillId}
              onChange={(e) => setSelectedSkillId(Number(e.target.value))}
              style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #CBD5E1", fontSize: "0.95rem" }}
            >
              {allSkills.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.category})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#0F172A", marginBottom: "6px" }}>
              Initial Proficiency: {proficiency}%
            </label>
            <input
              type="range"
              min="20"
              max="100"
              value={proficiency}
              onChange={(e) => setProficiency(Number(e.target.value))}
              style={{ width: "100%", accentColor: "#0284C7" }}
            />
          </div>

          <Button type="submit" variant="primary" size="lg" style={{ width: "100%", marginTop: "8px" }}>
            Save Skill & Continue
          </Button>
        </form>
      </Modal>
    </div>
  );
}
