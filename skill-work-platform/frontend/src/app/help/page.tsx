"use client";

import React, { useState } from "react";
import { HelpCircle, AlertTriangle, MessageCircle, FileText, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/common/Button";

export default function HelpPage() {
  const [reportType, setReportType] = useState("task");
  const [reportText, setReportText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleReport = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setReportText("");
    setTimeout(() => setSubmitted(false), 3000);
  };

  const faqs = [
    {
      q: "How does the work allocation system choose who gets notified?",
      a: "When suitable work arrives, our Eligibility Engine reads task requirements, verified worker skills, live availability, performance score, and daily task limits. Workers in higher performance tiers receive prioritized batch notifications first.",
    },
    {
      q: "What is Grab Work and why is it first-come, first-served?",
      a: "Rather than submitting proposals and waiting days, when an eligible task is allocated, you simply click 'Grab Work'. Atomic row-level database locking guarantees that the first eligible worker to grab secures the slot instantly.",
    },
    {
      q: "What is the daily work limit?",
      a: "Daily task limits prevent worker burnout and ensure fair distribution across all qualified workers. Higher worker levels unlock higher daily task allowances.",
    },
    {
      q: "When is payment released for a completed task?",
      a: "Once you upload deliverables in your task workspace and they are verified, payment is immediately released to your available balance and can be withdrawn via UPI or bank transfer.",
    },
  ];

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "28px" }}>
      <PageHeader
        title="Help & Support"
        subtitle="Frequently asked questions, task issue resolution, and support inquiries."
      />

      {/* FAQs */}
      <section style={{ backgroundColor: "#FFFFFF", borderRadius: "16px", border: "1px solid #E2E8F0", padding: "28px" }}>
        <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#0F172A", marginBottom: "16px" }}>
          Frequently Asked Questions
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {faqs.map((faq, i) => (
            <div key={i} style={{ padding: "16px", borderRadius: "10px", backgroundColor: "#F8FCFF", border: "1px solid #E2E8F0" }}>
              <h4 style={{ fontSize: "0.98rem", fontWeight: 700, color: "#0F172A", marginBottom: "6px" }}>
                {faq.q}
              </h4>
              <p style={{ fontSize: "0.9rem", color: "#475569", lineHeight: 1.55 }}>
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Report Task / Problem Form */}
      <section style={{ backgroundColor: "#FFFFFF", borderRadius: "16px", border: "1px solid #E2E8F0", padding: "28px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#D97706", fontWeight: 800, marginBottom: "6px" }}>
          <AlertTriangle size={20} />
          <h3 style={{ fontSize: "1.15rem", color: "#0F172A" }}>Report a Problem or Suspicious Task</h3>
        </div>
        <p style={{ color: "#64748B", fontSize: "0.88rem", marginBottom: "20px" }}>
          If you receive misleading instructions, unworkable requirements, or payment issues, report it below for priority manual review.
        </p>

        {submitted ? (
          <div style={{ padding: "20px", backgroundColor: "#DCFCE7", borderRadius: "10px", color: "#166534", fontWeight: 600, textAlign: "center" }}>
            <CheckCircle2 size={32} color="#16A34A" style={{ margin: "0 auto 8px" }} />
            Your issue report has been submitted. Our support team will review it within 2 hours.
          </div>
        ) : (
          <form onSubmit={handleReport} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#0F172A", marginBottom: "6px" }}>
                Issue Category
              </label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #CBD5E1", fontSize: "0.92rem", backgroundColor: "#FFFFFF" }}
              >
                <option value="task">Report Task (Unclear requirements or suspicious work)</option>
                <option value="payment">Payment Issue (Withdrawal or clearance delay)</option>
                <option value="assessment">Assessment Query (Score or question dispute)</option>
                <option value="account">Account & Verification</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#0F172A", marginBottom: "6px" }}>
                Description of Issue
              </label>
              <textarea
                rows={4}
                required
                value={reportText}
                onChange={(e) => setReportText(e.target.value)}
                placeholder="Please describe the issue in detail, including task ID or transaction ID if relevant..."
                style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #CBD5E1", fontSize: "0.92rem", resize: "vertical" }}
              />
            </div>

            <Button type="submit" variant="primary" size="md">
              Submit Report
            </Button>
          </form>
        )}
      </section>
    </div>
  );
}
