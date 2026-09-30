"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Zap, ArrowRight, Lock, Mail, UserCheck } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/common/Button";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("aman@example.com");
  const [password, setPassword] = useState("password123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || "Failed to log in.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setEmail("aman@example.com");
    setPassword("password123");
    setLoading(true);
    setError(null);
    try {
      await login("aman@example.com", "password123");
    } catch (err: any) {
      setError(err.message || "Failed to log in with demo account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "75vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px 16px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          backgroundColor: "#FFFFFF",
          borderRadius: "20px",
          border: "1px solid #E2E8F0",
          padding: "36px 32px",
          boxShadow: "0 10px 25px -5px rgba(15, 23, 42, 0.05)",
        }}
      >
        {/* Brand header */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "12px",
              backgroundColor: "#38BDF8",
              color: "#0F172A",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 12px",
            }}
          >
            <Zap size={24} fill="#0F172A" />
          </div>
          <h2 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#0F172A" }}>Worker Login</h2>
          <p style={{ color: "#64748B", fontSize: "0.9rem", marginTop: "4px" }}>
            Access your automated work dashboard
          </p>
        </div>

        {error && (
          <div
            style={{
              backgroundColor: "#FEF2F2",
              border: "1px solid #FECACA",
              color: "#DC2626",
              padding: "10px 14px",
              borderRadius: "10px",
              fontSize: "0.85rem",
              marginBottom: "18px",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#0F172A", marginBottom: "6px" }}>
              Email Address
            </label>
            <div style={{ position: "relative" }}>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={{
                  width: "100%",
                  padding: "12px 14px 12px 38px",
                  borderRadius: "10px",
                  border: "1px solid #CBD5E1",
                  fontSize: "0.92rem",
                  backgroundColor: "#FFFFFF",
                }}
              />
              <Mail size={16} color="#94A3B8" style={{ position: "absolute", left: "14px", top: "15px" }} />
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#0F172A", marginBottom: "6px" }}>
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: "100%",
                  padding: "12px 14px 12px 38px",
                  borderRadius: "10px",
                  border: "1px solid #CBD5E1",
                  fontSize: "0.92rem",
                  backgroundColor: "#FFFFFF",
                }}
              />
              <Lock size={16} color="#94A3B8" style={{ position: "absolute", left: "14px", top: "15px" }} />
            </div>
          </div>

          <Button type="submit" variant="primary" size="lg" loading={loading} style={{ width: "100%", marginTop: "8px" }}>
            Sign In to Dashboard
          </Button>

          {/* Quick Demo Login Button */}
          <button
            type="button"
            onClick={handleDemoLogin}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              padding: "10px",
              borderRadius: "10px",
              border: "1px dashed #38BDF8",
              backgroundColor: "#F0F9FF",
              color: "#0284C7",
              fontWeight: 700,
              fontSize: "0.88rem",
              cursor: "pointer",
            }}
          >
            <UserCheck size={16} />
            Quick 1-Click Demo (Aman Kumar)
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "24px", fontSize: "0.88rem", color: "#64748B" }}>
          Don&apos;t have an account?{" "}
          <Link href="/signup" style={{ color: "#0284C7", fontWeight: 700 }}>
            Sign up now
          </Link>
        </div>
      </div>
    </div>
  );
}
