"use client";

import React from "react";
import Link from "next/link";
import { User, CheckCircle2, MapPin, Mail, Phone, ExternalLink, Award, Star, Briefcase, GitBranch } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { PageHeader } from "@/components/layout/PageHeader";
import { ProgressBar } from "@/components/common/ProgressBar";
import { Button } from "@/components/common/Button";

export default function ProfilePage() {
  const { user, profile } = useAuth();

  const name = user?.full_name || "Aman Kumar";
  const headline = profile?.headline || "Backend Developer";
  const bio = profile?.bio || "Passionate backend engineer specializing in high-concurrency FastAPI microservices, PostgreSQL query optimization, and resilient work-allocation systems.";
  const location = profile?.location || "Bengaluru, India";
  const perf = profile?.performance;

  const skills = profile?.skills || [
    { skill: { name: "Python" }, proficiency_percentage: 91, level_tier: "Expert", is_verified: true },
    { skill: { name: "FastAPI" }, proficiency_percentage: 82, level_tier: "Advanced", is_verified: true },
    { skill: { name: "PostgreSQL" }, proficiency_percentage: 76, level_tier: "Skilled", is_verified: true },
    { skill: { name: "Git" }, proficiency_percentage: 88, level_tier: "Advanced", is_verified: true },
  ];

  return (
    <div style={{ maxWidth: "920px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Profile Header Card */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "18px",
          border: "1px solid #E2E8F0",
          padding: "32px",
          boxShadow: "0 2px 8px rgba(15, 23, 42, 0.04)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "20px" }}>
          <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
            <div
              style={{
                width: "72px",
                height: "72px",
                borderRadius: "18px",
                backgroundColor: "#E0F2FE",
                color: "#0284C7",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.8rem",
                fontWeight: 800,
              }}
            >
              {name[0]}
            </div>

            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#0F172A", textTransform: "uppercase" }}>
                  {name}
                </h1>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    backgroundColor: "#DCFCE7",
                    color: "#16A34A",
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    padding: "3px 8px",
                    borderRadius: "6px",
                  }}
                >
                  <CheckCircle2 size={13} />
                  Verified Worker ✓
                </span>
              </div>
              <div style={{ fontSize: "1.1rem", fontWeight: 600, color: "#0284C7", marginTop: "2px" }}>
                {headline}
              </div>
              <div style={{ display: "flex", gap: "16px", color: "#64748B", fontSize: "0.85rem", marginTop: "6px" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <MapPin size={14} /> {location}
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <Mail size={14} /> {user?.email || "aman@example.com"}
                </span>
              </div>
            </div>
          </div>

          <Link href="/settings/account">
            <Button variant="outline" size="sm">
              Edit Profile
            </Button>
          </Link>
        </div>

        <p style={{ color: "#475569", fontSize: "0.95rem", lineHeight: 1.6, marginTop: "20px" }}>
          {bio}
        </p>

        {/* Links */}
        <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
          {profile?.github_url && (
            <a
              href={profile.github_url}
              target="_blank"
              rel="noreferrer"
              style={{ fontSize: "0.85rem", fontWeight: 600, color: "#0284C7", display: "flex", alignItems: "center", gap: "4px" }}
            >
              GitHub <ExternalLink size={13} />
            </a>
          )}
          {profile?.portfolio_url && (
            <a
              href={profile.portfolio_url}
              target="_blank"
              rel="noreferrer"
              style={{ fontSize: "0.85rem", fontWeight: 600, color: "#0284C7", display: "flex", alignItems: "center", gap: "4px" }}
            >
              Portfolio Website <ExternalLink size={13} />
            </a>
          )}
        </div>
      </div>

      {/* Performance Summary Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
        {[
          { label: "Tasks Completed", value: `${perf?.tasks_completed ?? 24}`, sub: "100% verified" },
          { label: "Completion Rate", value: `${perf?.completion_rate ?? 97}%`, sub: "Top 5% on platform" },
          { label: "Average Rating", value: `${perf?.average_rating ?? 4.8} / 5`, sub: "Based on client reviews", icon: Star },
          { label: "On-Time Delivery", value: `${perf?.on_time_delivery_rate ?? 96}%`, sub: "Reliability rating" },
        ].map((item, idx) => (
          <div
            key={idx}
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "16px",
              border: "1px solid #E2E8F0",
              padding: "20px",
              textAlign: "left",
            }}
          >
            <div style={{ fontSize: "0.78rem", color: "#64748B", fontWeight: 600 }}>{item.label}</div>
            <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#0F172A", margin: "4px 0" }}>
              {item.value}
            </div>
            <div style={{ fontSize: "0.75rem", color: "#0284C7", fontWeight: 500 }}>{item.sub}</div>
          </div>
        ))}
      </div>

      {/* Verified Skills */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "16px",
          border: "1px solid #E2E8F0",
          padding: "24px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
          <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#0F172A" }}>
            Verified Skills Competencies
          </h3>
          <Link href="/skills">
            <Button variant="secondary" size="sm">
              Manage Skills
            </Button>
          </Link>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px" }}>
          {skills.map((ws: any, idx: number) => (
            <div key={idx} style={{ padding: "16px", borderRadius: "10px", backgroundColor: "#F8FCFF", border: "1px solid #E2E8F0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <span style={{ fontWeight: 700, color: "#0F172A", fontSize: "0.95rem" }}>
                  {ws.skill?.name || "Python"}
                </span>
                <span style={{ fontWeight: 800, color: "#0284C7", fontSize: "0.95rem" }}>
                  {ws.proficiency_percentage}%
                </span>
              </div>
              <ProgressBar progress={ws.proficiency_percentage} color="#38BDF8" height={6} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "#64748B", marginTop: "6px" }}>
                <span>{ws.level_tier}</span>
                <span style={{ color: "#16A34A", fontWeight: 600 }}>Verified ✓</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Portfolio Items */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "16px",
          border: "1px solid #E2E8F0",
          padding: "24px",
        }}
      >
        <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#0F172A", marginBottom: "16px" }}>
          Featured Portfolio Projects
        </h3>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
          {[
            {
              title: "Async Task Allocation Engine",
              desc: "Distributed task scheduler with atomic grab logic, concurrency locking, and Postgres.",
              skills: "Python, FastAPI, PostgreSQL",
            },
            {
              title: "Real-time Notification Service",
              desc: "Push pipeline delivering alerts under 50ms latency for urgent vacancies.",
              skills: "Python, AsyncIO, WebSockets",
            },
          ].map((item, i) => (
            <div key={i} style={{ padding: "16px", borderRadius: "12px", backgroundColor: "#F8FCFF", border: "1px solid #E2E8F0" }}>
              <h4 style={{ fontSize: "1rem", fontWeight: 700, color: "#0F172A", marginBottom: "4px" }}>
                {item.title}
              </h4>
              <p style={{ color: "#64748B", fontSize: "0.85rem", lineHeight: 1.5, marginBottom: "8px" }}>
                {item.desc}
              </p>
              <span style={{ fontSize: "0.75rem", color: "#0284C7", fontWeight: 600 }}>
                {item.skills}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
