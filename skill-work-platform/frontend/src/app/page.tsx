"use client";

import React from "react";
import Link from "next/link";
import { Zap, ArrowRight, CheckCircle2, ShieldCheck, Clock, Award, Wallet, ArrowDown } from "lucide-react";
import { Button } from "@/components/common/Button";

export default function LandingPage() {
  return (
    <div style={{ padding: "20px 0 60px" }}>
      {/* Hero Section */}
      <section
        style={{
          textAlign: "center",
          maxWidth: "840px",
          margin: "40px auto 70px",
          padding: "0 16px",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            backgroundColor: "#E0F2FE",
            color: "#0284C7",
            padding: "6px 16px",
            borderRadius: "9999px",
            fontSize: "0.85rem",
            fontWeight: 700,
            marginBottom: "20px",
          }}
        >
          <Zap size={15} fill="#0284C7" />
          A New Work-Allocation System
        </div>

        <h1
          style={{
            fontSize: "3.2rem",
            fontWeight: 800,
            color: "#0F172A",
            letterSpacing: "-1.2px",
            lineHeight: 1.15,
            marginBottom: "20px",
          }}
        >
          Let the work <span style={{ color: "#0284C7" }}>find you.</span>
        </h1>

        <p
          style={{
            fontSize: "1.2rem",
            color: "#475569",
            lineHeight: 1.6,
            marginBottom: "36px",
            maxWidth: "680px",
            margin: "0 auto 36px",
          }}
        >
          Don&apos;t spend hours searching through hundreds of job listings, submitting proposals, and waiting for replies.
          Build your skills, stay available, and receive direct work notifications the moment matching opportunities arrive.
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap", marginBottom: "40px" }}>
          <Link href="/signup">
            <Button variant="primary" size="lg" icon={<ArrowRight size={18} />}>
              Get Started
            </Button>
          </Link>
          <a href="#how-it-works">
            <Button variant="outline" size="lg">
              How It Works
            </Button>
          </a>
          <Link href="/dashboard">
            <Button variant="secondary" size="lg" icon={<Zap size={16} />}>
              Enter Demo Dashboard
            </Button>
          </Link>
        </div>

        {/* Philosophy Badge Banner */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            backgroundColor: "#FFFFFF",
            border: "1px solid #E2E8F0",
            padding: "12px 24px",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(15, 23, 42, 0.04)",
          }}
        >
          <span style={{ fontSize: "0.92rem", color: "#64748B" }}>Core Philosophy:</span>
          <span style={{ fontSize: "0.95rem", fontWeight: 700, color: "#0F172A" }}>
            &ldquo;Don&apos;t make workers search for work. Bring suitable work to them.&rdquo;
          </span>
        </div>
      </section>

      {/* 4 Simple Steps */}
      <section style={{ maxWidth: "1080px", margin: "0 auto 80px", padding: "0 16px" }}>
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <h2 style={{ fontSize: "1.85rem", fontWeight: 800, color: "#0F172A", letterSpacing: "-0.5px" }}>
            The 4-Step Journey
          </h2>
          <p style={{ color: "#64748B", fontSize: "0.95rem", marginTop: "6px" }}>
            A transparent, merit-driven allocation pipeline designed for students and working professionals.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px" }}>
          {[
            { step: "01", title: "Add Your Skills", desc: "Select your real capabilities across Development, Design, Data, or Writing.", icon: Award },
            { step: "02", title: "Verify Your Ability", desc: "Complete short practical assessments to earn verification badges.", icon: ShieldCheck },
            { step: "03", title: "Stay Available", desc: "Turn on your availability switch with a single tap whenever you have free time.", icon: Clock },
            { step: "04", title: "Grab Suitable Work", desc: "Instant alert sounds when matching tasks arrive. First eligible click gets the job.", icon: Zap },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "16px",
                  border: "1px solid #E2E8F0",
                  padding: "26px",
                  boxShadow: "0 2px 6px rgba(15, 23, 42, 0.04)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div
                    style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "10px",
                      backgroundColor: "#E0F2FE",
                      color: "#0284C7",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon size={20} />
                  </div>
                  <span style={{ fontSize: "1.3rem", fontWeight: 800, color: "#CBD5E1" }}>{item.step}</span>
                </div>
                <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#0F172A" }}>{item.title}</h3>
                <p style={{ fontSize: "0.9rem", color: "#64748B", lineHeight: 1.5 }}>{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Full Process / How It Works */}
      <section id="how-it-works" style={{ maxWidth: "1080px", margin: "0 auto 80px", padding: "0 16px" }}>
        <div style={{ backgroundColor: "#FFFFFF", borderRadius: "20px", border: "1px solid #E2E8F0", padding: "40px 32px", boxShadow: "0 4px 16px rgba(15, 23, 42, 0.05)" }}>
          <div style={{ textAlign: "center", marginBottom: "36px" }}>
            <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#0284C7", textTransform: "uppercase", letterSpacing: "1px" }}>
              Engineered For Speed & Fairness
            </span>
            <h2 style={{ fontSize: "2rem", fontWeight: 800, color: "#0F172A", marginTop: "6px" }}>
              How The Entire System Operates
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
            {[
              { num: "STEP 1", title: "Build Your Profile", text: "Fill your education, bio, and portfolio links." },
              { num: "STEP 2", title: "Verify Your Skills", text: "Demonstrate competence through objective benchmarks." },
              { num: "STEP 3", title: "Stay Available", text: "Toggle your 🟢 Available switch to receive matching tasks." },
              { num: "STEP 4", title: "Get Notified", text: "Our Eligibility Engine dispatches targeted notifications in priority tiers." },
              { num: "STEP 5", title: "Grab Work", text: "Click Grab Work. Atomic database locking secures your spot instantly." },
              { num: "STEP 6", title: "Complete & Get Paid", text: "Upload deliverables, receive approval, and withdraw earnings." },
            ].map((s, idx) => (
              <div key={idx} style={{ padding: "18px", borderRadius: "12px", backgroundColor: "#F8FCFF", border: "1px solid #E2E8F0" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#0284C7", backgroundColor: "#E0F2FE", padding: "2px 8px", borderRadius: "4px" }}>
                  {s.num}
                </span>
                <h4 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#0F172A", margin: "10px 0 6px" }}>{s.title}</h4>
                <p style={{ fontSize: "0.88rem", color: "#64748B", lineHeight: 1.5 }}>{s.text}</p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: "36px" }}>
            <Link href="/signup">
              <Button variant="primary" size="lg" icon={<ArrowRight size={18} />}>
                Join as a Worker Today
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
