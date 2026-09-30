"use client";

import React, { useState } from "react";
import { UploadCloud, File, X, CheckCircle2 } from "lucide-react";
import { Button } from "../common/Button";

interface UploadedItem {
  name: string;
  size: number;
  type: string;
  url: string;
}

interface SubmissionFormProps {
  assignmentId: number;
  onSubmit: (notes: string, files: UploadedItem[]) => Promise<boolean>;
}

export const SubmissionForm: React.FC<SubmissionFormProps> = ({
  assignmentId,
  onSubmit,
}) => {
  const [notes, setNotes] = useState("");
  const [files, setFiles] = useState<UploadedItem[]>([
    { name: "main_implementation.py", size: 14500, type: "code/python", url: "/uploads/main_implementation.py" },
    { name: "tests_validation.py", size: 6200, type: "code/python", url: "/uploads/tests_validation.py" },
  ]);
  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFiles((prev) => [
        ...prev,
        {
          name: file.name,
          size: file.size,
          type: file.type || "application/octet-stream",
          url: `/uploads/${file.name}`,
        },
      ]);
    }
  };

  const removeFile = (idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) {
      alert("Please upload at least one deliverable file or repository link.");
      return;
    }

    setSubmitting(true);
    const ok = await onSubmit(notes, files);
    setSubmitting(false);

    if (ok) {
      setSubmittedSuccess(true);
    }
  };

  if (submittedSuccess) {
    return (
      <div
        style={{
          padding: "36px",
          backgroundColor: "#DCFCE7",
          borderRadius: "16px",
          border: "1px solid #BBF7D0",
          textAlign: "center",
        }}
      >
        <CheckCircle2 size={48} color="#16A34A" style={{ margin: "0 auto 16px" }} />
        <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#166534", marginBottom: "8px" }}>
          Deliverables Successfully Submitted!
        </h3>
        <p style={{ color: "#15803D", fontSize: "0.95rem", maxWidth: "500px", margin: "0 auto" }}>
          Your submission is now under review. You will be automatically notified once approved and payment is credited to your balance.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: "16px",
        border: "1px solid #E2E8F0",
        padding: "24px",
      }}
    >
      <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#0F172A", marginBottom: "6px" }}>
        Submit Work Deliverable
      </h3>
      <p style={{ color: "#64748B", fontSize: "0.88rem", marginBottom: "20px" }}>
        Upload your code files, ZIP archives, design files, or write notes before submitting for review.
      </p>

      {/* Drag & Drop File Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const f = e.dataTransfer.files[0];
            setFiles((prev) => [
              ...prev,
              { name: f.name, size: f.size, type: f.type, url: `/uploads/${f.name}` },
            ]);
          }
        }}
        style={{
          border: `2px dashed ${dragActive ? "#38BDF8" : "#CBD5E1"}`,
          borderRadius: "12px",
          backgroundColor: dragActive ? "#F0F9FF" : "#F8FCFF",
          padding: "28px",
          textAlign: "center",
          cursor: "pointer",
          marginBottom: "18px",
          position: "relative",
          transition: "all 0.2s ease",
        }}
      >
        <input
          type="file"
          onChange={handleFileUpload}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            opacity: 0,
            cursor: "pointer",
          }}
        />
        <UploadCloud size={36} color="#0284C7" style={{ margin: "0 auto 10px" }} />
        <div style={{ fontWeight: 700, color: "#0F172A", fontSize: "0.95rem" }}>
          Click to upload or drag & drop files
        </div>
        <div style={{ color: "#64748B", fontSize: "0.8rem", marginTop: "4px" }}>
          Supports ZIP, Code (.py, .js, .tsx), PDFs, Images, and Documents (up to 50MB)
        </div>
      </div>

      {/* Uploaded Files List */}
      {files.length > 0 && (
        <div style={{ marginBottom: "20px", display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#475569" }}>Attached Files:</div>
          {files.map((file, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "8px 14px",
                borderRadius: "8px",
                backgroundColor: "#F1F5F9",
                border: "1px solid #E2E8F0",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <File size={16} color="#0284C7" />
                <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#0F172A" }}>{file.name}</span>
                <span style={{ fontSize: "0.75rem", color: "#64748B" }}>({(file.size / 1024).toFixed(1)} KB)</span>
              </div>
              <button
                type="button"
                onClick={() => removeFile(idx)}
                style={{ color: "#94A3B8", cursor: "pointer", display: "flex", alignItems: "center" }}
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Submission Note */}
      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#0F172A", marginBottom: "6px" }}>
          Submission Notes & Instructions for Reviewer
        </label>
        <textarea
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Briefly describe what you built, setup instructions, or repository links..."
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "10px",
            border: "1px solid #CBD5E1",
            fontSize: "0.9rem",
            backgroundColor: "#FFFFFF",
            resize: "vertical",
          }}
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        loading={submitting}
        icon={<CheckCircle2 size={18} />}
        style={{ width: "100%" }}
      >
        Submit Work for Review
      </Button>
    </form>
  );
};
