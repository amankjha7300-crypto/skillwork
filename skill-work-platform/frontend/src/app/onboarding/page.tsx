"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, ArrowRight, ArrowLeft, Shield, Clock, Award, Briefcase, User, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { Button } from "@/components/common/Button";
import { ProgressBar } from "@/components/common/ProgressBar";

export default function OnboardingPage() {
  const { profile, refreshProfile } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Step 1: Basic Information
  const [headline, setHeadline] = useState("Backend Developer");
  const [bio, setBio] = useState("Python and FastAPI microservices engineer with interest in scalable architectures.");
  const [location, setLocation] = useState("Bengaluru, India");

  // Step 2: Skills
  const [availableSkills, setAvailableSkills] = useState<any[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<number[]>([1, 2]); // Python, FastAPI

  // Step 3: Experience
  const [experienceYears, setExperienceYears] = useState("3");
  const [education, setEducation] = useState("B.Tech in Computer Science");

  // Step 4: Portfolio
  const [githubUrl, setGithubUrl] = useState("https://github.com/amankumar");
  const [portfolioUrl, setPortfolioUrl] = useState("https://amankumar.dev");

  // Step 6: Availability
  const [isAvailable, setIsAvailable] = useState(true);

  useEffect(() => {
    api.listSkills().then(setAvailableSkills).catch(console.error);
    if (profile) {
      if (profile.headline) setHeadline(profile.headline);
      if (profile.bio) setBio(profile.bio);
      if (profile.location) setLocation(profile.location);
      if (profile.onboarding_step) setStep(profile.onboarding_step);
    }
  }, [profile]);

  const toggleSkill = (id: number) => {
    setSelectedSkills((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleNext = async () => {
    setLoading(true);
    try {
      if (step === 1) {
        await api.updateProfile({ headline, bio, location, onboarding_step: 2 });
        setStep(2);
      } else if (step === 2) {
        // Save selected skills
        for (const sid of selectedSkills) {
          await api.saveWorkerSkill({ skill_id: sid, proficiency_percentage: 85, level_tier: "Advanced" });
        }
        await api.updateProfile({ onboarding_step: 3 });
        setStep(3);
      } else if (step === 3) {
        await api.updateProfile({ experience_years: parseFloat(experienceYears) || 1, education, onboarding_step: 4 });
        setStep(4);
      } else if (step === 4) {
        await api.updateProfile({ github_url: githubUrl, portfolio_url: portfolioUrl, onboarding_step: 5 });
        setStep(5);
      } else if (step === 5) {
        // Assessment step, can proceed or take test
        await api.updateProfile({ onboarding_step: 6 });
        setStep(6);
      } else if (step === 6) {
        await api.updateAvailability({ is_available: isAvailable, available_skills_filter: selectedSkills });
        await api.updateProfile({ onboarding_step: 7, onboarding_completed: true });
        setStep(7);
      } else if (step === 7) {
        await refreshProfile();
        router.push("/dashboard");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const progressPercent = Math.round((step / 7) * 100);

  return (
    <div style={{ maxWidth: "640px", margin: "20px auto 40px", padding: "0 16px" }}>
      {/* Setup Progress Header */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "16px",
          border: "1px solid #E2E8F0",
          padding: "20px 24px",
          marginBottom: "24px",
          boxShadow: "0 2px 4px rgba(15, 23, 42, 0.04)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
          <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#0284C7" }}>
            Step {step} of 7: {step === 1 ? "Basic Info" : step === 2 ? "Select Skills" : step === 3 ? "Experience" : step === 4 ? "Portfolio" : step === 5 ? "Skill Assessment" : step === 6 ? "Work Availability" : "Complete Profile"}
          </span>
          <span style={{ fontSize: "0.9rem", fontWeight: 800, color: "#0F172A" }}>
            Profile setup: {progressPercent}%
          </span>
        </div>
        <ProgressBar progress={progressPercent} color="#38BDF8" height={8} />
      </div>

      {/* Step Content Card */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "20px",
          border: "1px solid #E2E8F0",
          padding: "32px",
          boxShadow: "0 4px 12px rgba(15, 23, 42, 0.04)",
        }}
      >
        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div>
            <h2 style={{ fontSize: "1.45rem", fontWeight: 800, color: "#0F172A", marginBottom: "6px" }}>
              Tell us about yourself
            </h2>
            <p style={{ color: "#64748B", fontSize: "0.9rem", marginBottom: "20px" }}>
              This helps the allocation system identify work in your domain.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#0F172A", marginBottom: "6px" }}>
                  Professional Headline
                </label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g. Backend Developer / UI Designer"
                  style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #CBD5E1" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#0F172A", marginBottom: "6px" }}>
                  Short Bio
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Briefly state your core interests and domain capabilities..."
                  style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #CBD5E1", resize: "vertical" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#0F172A", marginBottom: "6px" }}>
                  Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Bengaluru, India or Remote"
                  style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #CBD5E1" }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Skills Selection */}
        {step === 2 && (
          <div>
            <h2 style={{ fontSize: "1.45rem", fontWeight: 800, color: "#0F172A", marginBottom: "6px" }}>
              Select your skills
            </h2>
            <p style={{ color: "#64748B", fontSize: "0.9rem", marginBottom: "20px" }}>
              Choose the competencies for which you want to receive work notifications.
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "24px" }}>
              {availableSkills.map((sk) => {
                const isSelected = selectedSkills.includes(sk.id);
                return (
                  <button
                    key={sk.id}
                    type="button"
                    onClick={() => toggleSkill(sk.id)}
                    style={{
                      padding: "8px 16px",
                      borderRadius: "10px",
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      backgroundColor: isSelected ? "#38BDF8" : "#F8FCFF",
                      color: isSelected ? "#0F172A" : "#475569",
                      border: `1px solid ${isSelected ? "#0284C7" : "#CBD5E1"}`,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    {isSelected && <CheckCircle2 size={15} color="#0F172A" />}
                    {sk.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3: Experience & Education */}
        {step === 3 && (
          <div>
            <h2 style={{ fontSize: "1.45rem", fontWeight: 800, color: "#0F172A", marginBottom: "6px" }}>
              Experience & Education
            </h2>
            <p style={{ color: "#64748B", fontSize: "0.9rem", marginBottom: "20px" }}>
              Helps establish baseline difficulty tiers for task allocation.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#0F172A", marginBottom: "6px" }}>
                  Years of Experience
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(e.target.value)}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #CBD5E1" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#0F172A", marginBottom: "6px" }}>
                  Highest Education
                </label>
                <input
                  type="text"
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  placeholder="e.g. B.Tech / B.Sc / Self-Taught"
                  style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #CBD5E1" }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Portfolio Links */}
        {step === 4 && (
          <div>
            <h2 style={{ fontSize: "1.45rem", fontWeight: 800, color: "#0F172A", marginBottom: "6px" }}>
              Portfolio & Profiles
            </h2>
            <p style={{ color: "#64748B", fontSize: "0.9rem", marginBottom: "20px" }}>
              Add links where clients or reviewers can reference past accomplishments.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#0F172A", marginBottom: "6px" }}>
                  GitHub / Code Profile URL
                </label>
                <input
                  type="url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/yourusername"
                  style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #CBD5E1" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#0F172A", marginBottom: "6px" }}>
                  Portfolio / Behance / Website
                </label>
                <input
                  type="url"
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  placeholder="https://yourportfolio.dev"
                  style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #CBD5E1" }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Skill Assessment */}
        {step === 5 && (
          <div>
            <h2 style={{ fontSize: "1.45rem", fontWeight: 800, color: "#0F172A", marginBottom: "6px" }}>
              Skill Assessment
            </h2>
            <p style={{ color: "#64748B", fontSize: "0.9rem", marginBottom: "20px" }}>
              To receive high-paying tasks, skills must be verified. You can complete tests now or anytime from your dashboard.
            </p>

            <div style={{ backgroundColor: "#F0F9FF", border: "1px solid #BAE6FD", borderRadius: "12px", padding: "18px", marginBottom: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#0284C7", fontWeight: 700, marginBottom: "4px" }}>
                <Shield size={18} />
                <span>Verification Ready</span>
              </div>
              <p style={{ fontSize: "0.85rem", color: "#475569" }}>
                Your selected skills (Python, FastAPI) are pre-qualified for Level 3 allocations.
              </p>
            </div>
          </div>
        )}

        {/* Step 6: Work Availability */}
        {step === 6 && (
          <div>
            <h2 style={{ fontSize: "1.45rem", fontWeight: 800, color: "#0F172A", marginBottom: "6px" }}>
              Set Work Availability
            </h2>
            <p style={{ color: "#64748B", fontSize: "0.9rem", marginBottom: "20px" }}>
              Only workers who are currently available receive instant work notifications.
            </p>

            <div
              onClick={() => setIsAvailable(!isAvailable)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "20px",
                borderRadius: "12px",
                border: `2px solid ${isAvailable ? "#38BDF8" : "#E2E8F0"}`,
                backgroundColor: isAvailable ? "#F0F9FF" : "#FFFFFF",
                cursor: "pointer",
                marginBottom: "20px",
              }}
            >
              <div>
                <div style={{ fontWeight: 800, color: "#0F172A", fontSize: "1.05rem" }}>
                  {isAvailable ? "🟢 Currently Available for Work" : "⚪ Not Available"}
                </div>
                <div style={{ fontSize: "0.85rem", color: "#64748B", marginTop: "4px" }}>
                  Send me instant alerts when suitable work opens up.
                </div>
              </div>
              <div
                style={{
                  width: "48px",
                  height: "26px",
                  backgroundColor: isAvailable ? "#38BDF8" : "#CBD5E1",
                  borderRadius: "9999px",
                  position: "relative",
                  transition: "all 0.2s ease",
                }}
              >
                <div
                  style={{
                    width: "20px",
                    height: "20px",
                    backgroundColor: "#FFFFFF",
                    borderRadius: "50%",
                    position: "absolute",
                    top: "3px",
                    left: isAvailable ? "25px" : "3px",
                    transition: "all 0.2s ease",
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 7: Completed */}
        {step === 7 && (
          <div style={{ textAlign: "center", padding: "16px 0" }}>
            <div
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                backgroundColor: "#DCFCE7",
                color: "#16A34A",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}
            >
              <Sparkles size={32} />
            </div>
            <h2 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#0F172A", marginBottom: "8px" }}>
              Profile Setup Complete!
            </h2>
            <p style={{ color: "#64748B", fontSize: "0.95rem", lineHeight: 1.5, marginBottom: "28px" }}>
              Your profile is verified and active. The allocation system is actively monitoring new work vacancies that match your capabilities.
            </p>
          </div>
        )}

        {/* Action Controls */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "28px", borderTop: "1px solid #F1F5F9", paddingTop: "20px" }}>
          {step > 1 && step < 7 ? (
            <Button variant="outline" size="md" onClick={() => setStep((s) => s - 1)} icon={<ArrowLeft size={16} />}>
              Back
            </Button>
          ) : (
            <div />
          )}

          <Button variant="primary" size="md" loading={loading} onClick={handleNext} icon={<ArrowRight size={16} />}>
            {step === 7 ? "Go to Worker Dashboard" : "Save & Continue"}
          </Button>
        </div>
      </div>
    </div>
  );
}
