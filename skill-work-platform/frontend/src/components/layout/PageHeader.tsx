import React from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  badge,
  actions,
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: "16px",
        marginBottom: "24px",
        flexWrap: "wrap",
      }}
    >
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#0F172A", letterSpacing: "-0.5px" }}>
            {title}
          </h1>
          {badge}
        </div>
        {subtitle && (
          <p style={{ color: "#64748B", fontSize: "0.95rem", marginTop: "4px" }}>
            {subtitle}
          </p>
        )}
      </div>
      {actions && (
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {actions}
        </div>
      )}
    </div>
  );
};
