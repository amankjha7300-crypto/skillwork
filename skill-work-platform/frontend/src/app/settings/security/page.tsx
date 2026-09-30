"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Lock, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/common/Button";

export default function SecuritySettingsPage() {
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
    setCurrentPwd("");
    setNewPwd("");
    setTimeout(() => setSuccess(false), 3000);
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

      <PageHeader title="Security & Passwords" subtitle="Manage your account password and security credentials." />

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
            Current Password
          </label>
          <input
            type="password"
            required
            value={currentPwd}
            onChange={(e) => setCurrentPwd(e.target.value)}
            style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #CBD5E1" }}
          />
        </div>

        <div>
          <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#0F172A", marginBottom: "6px" }}>
            New Password
          </label>
          <input
            type="password"
            required
            minLength={6}
            value={newPwd}
            onChange={(e) => setNewPwd(e.target.value)}
            style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #CBD5E1" }}
          />
        </div>

        {success && (
          <div style={{ color: "#16A34A", fontSize: "0.88rem", fontWeight: 600 }}>
            Password updated successfully.
          </div>
        )}

        <Button type="submit" variant="primary" size="md">
          Update Password
        </Button>
      </form>
    </div>
  );
}
