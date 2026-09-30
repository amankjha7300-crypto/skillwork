"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Zap, User, Mail, Lock, Phone } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/common/Button";

export default function SignupPage() {
  const { register } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await register(fullName, email, password, phone);
    } catch (err: any) {
      setError(err.message || "Failed to create account.");
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
          maxWidth: "440px",
          backgroundColor: "#FFFFFF",
          borderRadius: "20px",
          border: "1px solid #E2E8F0",
          padding: "36px 32px",
          boxShadow: "0 10px 25px -5px rgba(15, 23, 42, 0.05)",
        }}
      >
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
          <h2 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#0F172A" }}>Create Worker Account</h2>
          <p style={{ color: "#64748B", fontSize: "0.9rem", marginTop: "4px" }}>
            Start receiving suitable work allocations directly
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
              Full Name
            </label>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Aman Kumar"
                style={{
                  width: "100%",
                  padding: "12px 14px 12px 38px",
                  borderRadius: "10px",
                  border: "1px solid #CBD5E1",
                  fontSize: "0.92rem",
                  backgroundColor: "#FFFFFF",
                }}
              />
              <User size={16} color="#94A3B8" style={{ position: "absolute", left: "14px", top: "15px" }} />
            </div>
          </div>

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
                placeholder="aman@example.com"
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
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
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

          <div>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#0F172A", marginBottom: "6px" }}>
              Phone Number
            </label>
            <div style={{ position: "relative" }}>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                style={{
                  width: "100%",
                  padding: "12px 14px 12px 38px",
                  borderRadius: "10px",
                  border: "1px solid #CBD5E1",
                  fontSize: "0.92rem",
                  backgroundColor: "#FFFFFF",
                }}
              />
              <Phone size={16} color="#94A3B8" style={{ position: "absolute", left: "14px", top: "15px" }} />
            </div>
          </div>

          <Button type="submit" variant="primary" size="lg" loading={loading} style={{ width: "100%", marginTop: "6px" }}>
            Create Account & Continue
          </Button>
        </form>

        <div style={{ textAlign: "center", marginTop: "24px", fontSize: "0.88rem", color: "#64748B" }}>
          Already have an account?{" "}
          <Link href="/login" style={{ color: "#0284C7", fontWeight: 700 }}>
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
