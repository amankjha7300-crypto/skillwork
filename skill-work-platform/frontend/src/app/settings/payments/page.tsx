"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CreditCard, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/common/Button";

export default function PaymentSettingsPage() {
  const [upiId, setUpiId] = useState("aman@okaxis");
  const [bankAccount, setBankAccount] = useState("987654321098");
  const [ifsc, setIfsc] = useState("SBIN0001234");
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div style={{ maxWidth: "640px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <Link
          href="/settings"
          style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "0.9rem", fontWeight: 700, color: "#0284C7" }}
        >
          <ArrowLeft size={16} /> Back to Settings
        </Link>
      </div>

      <PageHeader title="Payment & Payout Settings" subtitle="Configure automated withdrawal destinations for your earnings." />

      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "16px",
          border: "1px solid #E2E8F0",
          padding: "28px",
          display: "flex",
          flexDirection: "column",
          gap: "18px",
        }}
      >
        <div>
          <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#0F172A", marginBottom: "6px" }}>
            Default UPI ID (Fastest Transfer)
          </label>
          <input
            type="text"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            placeholder="mobile@upi or user@okicici"
            style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #CBD5E1" }}
          />
        </div>

        <div style={{ borderTop: "1px solid #F1F5F9", paddingTop: "16px" }}>
          <h4 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#0F172A", marginBottom: "12px" }}>
            Direct Bank Account Details
          </h4>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.8rem", color: "#64748B", marginBottom: "4px" }}>
                Account Number
              </label>
              <input
                type="text"
                value={bankAccount}
                onChange={(e) => setBankAccount(e.target.value)}
                style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #CBD5E1" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.8rem", color: "#64748B", marginBottom: "4px" }}>
                IFSC Code
              </label>
              <input
                type="text"
                value={ifsc}
                onChange={(e) => setIfsc(e.target.value)}
                style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #CBD5E1" }}
              />
            </div>
          </div>
        </div>

        {saved && <div style={{ color: "#16A34A", fontSize: "0.88rem", fontWeight: 600 }}>Payment details saved.</div>}

        <Button type="submit" variant="primary" size="md">
          Save Payout Settings
        </Button>
      </form>
    </div>
  );
}
