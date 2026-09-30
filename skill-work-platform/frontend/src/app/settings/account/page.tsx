"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/common/Button";

export default function AccountSettingsPage() {
  const { user, profile, refreshProfile } = useAuth();

  const [headline, setHeadline] = useState(profile?.headline || "Backend Developer");
  const [bio, setBio] = useState(profile?.bio || "");
  const [location, setLocation] = useState(profile?.location || "Bengaluru, India");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      await api.updateProfile({ headline, bio, location });
      await refreshProfile();
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: "680px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <Link
          href="/settings"
          style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "0.9rem", fontWeight: 700, color: "#0284C7" }}
        >
          <ArrowLeft size={16} /> Back to Settings
        </Link>
      </div>

      <PageHeader
        title="Account Settings"
        subtitle="Manage your professional summary and worker metadata."
      />

      <form
        onSubmit={handleSave}
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
            Full Name
          </label>
          <input
            type="text"
            disabled
            value={user?.full_name || "Aman Kumar"}
            style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #E2E8F0", backgroundColor: "#F8FCFF", color: "#64748B" }}
          />
        </div>

        <div>
          <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#0F172A", marginBottom: "6px" }}>
            Email Address
          </label>
          <input
            type="email"
            disabled
            value={user?.email || "aman@example.com"}
            style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #E2E8F0", backgroundColor: "#F8FCFF", color: "#64748B" }}
          />
        </div>

        <div>
          <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#0F172A", marginBottom: "6px" }}>
            Professional Headline
          </label>
          <input
            type="text"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #CBD5E1" }}
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
            style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #CBD5E1" }}
          />
        </div>

        <div>
          <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#0F172A", marginBottom: "6px" }}>
            Bio
          </label>
          <textarea
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #CBD5E1", resize: "vertical" }}
          />
        </div>

        {saved && (
          <div style={{ color: "#16A34A", fontSize: "0.88rem", fontWeight: 600 }}>
            Profile settings updated successfully!
          </div>
        )}

        <Button type="submit" variant="primary" size="md" loading={saving} icon={<Save size={16} />}>
          Save Changes
        </Button>
      </form>
    </div>
  );
}
