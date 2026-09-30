import React from "react";

interface ProgressBarProps {
  progress: number; // 0 to 100
  color?: string;
  height?: number;
  label?: string;
  showPercentage?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color = "#38BDF8",
  height = 8,
  label,
  showPercentage = false,
}) => {
  const clamped = Math.min(100, Math.max(0, progress));

  return (
    <div style={{ width: "100%" }}>
      {(label || showPercentage) && (
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", fontSize: "0.85rem", color: "#64748B", fontWeight: 500 }}>
          {label && <span>{label}</span>}
          {showPercentage && <span style={{ fontWeight: 600, color: "#0F172A" }}>{clamped}%</span>}
        </div>
      )}
      <div style={{ width: "100%", height: `${height}px`, backgroundColor: "#E2E8F0", borderRadius: "9999px", overflow: "hidden" }}>
        <div
          style={{
            width: `${clamped}%`,
            height: "100%",
            backgroundColor: color,
            borderRadius: "9999px",
            transition: "width 0.4s ease-in-out",
          }}
        />
      </div>
    </div>
  );
};
