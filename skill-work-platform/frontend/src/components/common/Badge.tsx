import React from "react";

interface BadgeProps {
  variant?: "sky" | "success" | "warning" | "error" | "neutral";
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ variant = "sky", children, icon }) => {
  const styles: Record<string, React.CSSProperties> = {
    sky: { backgroundColor: "#E0F2FE", color: "#0284C7", border: "1px solid #BAE6FD" },
    success: { backgroundColor: "#DCFCE7", color: "#16A34A", border: "1px solid #BBF7D0" },
    warning: { backgroundColor: "#FEF3C7", color: "#D97706", border: "1px solid #FDE68A" },
    error: { backgroundColor: "#FEE2E2", color: "#DC2626", border: "1px solid #FECACA" },
    neutral: { backgroundColor: "#F1F5F9", color: "#475569", border: "1px solid #E2E8F0" },
  };

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        padding: "3px 10px",
        borderRadius: "9999px",
        fontSize: "0.8rem",
        fontWeight: 600,
        ...styles[variant],
      }}
    >
      {icon}
      {children}
    </span>
  );
};
