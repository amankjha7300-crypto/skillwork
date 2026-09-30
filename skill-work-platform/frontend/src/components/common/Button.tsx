import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger" | "success" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  className = "",
  disabled,
  ...props
}) => {
  const baseStyles: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    fontWeight: 600,
    borderRadius: "10px",
    transition: "all 0.2s ease",
    cursor: disabled || loading ? "not-allowed" : "pointer",
    opacity: disabled || loading ? 0.65 : 1,
    border: "1px solid transparent",
  };

  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: { padding: "6px 12px", fontSize: "0.85rem" },
    md: { padding: "10px 18px", fontSize: "0.95rem" },
    lg: { padding: "14px 26px", fontSize: "1.05rem" },
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      backgroundColor: "#38BDF8",
      color: "#0F172A",
      boxShadow: "0 2px 8px rgba(56, 189, 248, 0.35)",
    },
    secondary: {
      backgroundColor: "#E0F2FE",
      color: "#0284C7",
    },
    outline: {
      backgroundColor: "transparent",
      borderColor: "#E2E8F0",
      color: "#0F172A",
    },
    success: {
      backgroundColor: "#16A34A",
      color: "#FFFFFF",
    },
    danger: {
      backgroundColor: "#EF4444",
      color: "#FFFFFF",
    },
    ghost: {
      backgroundColor: "transparent",
      color: "#64748B",
    },
  };

  return (
    <button
      style={{
        ...baseStyles,
        ...sizeStyles[size],
        ...variantStyles[variant],
      }}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span style={{ display: "inline-block", width: "16px", height: "16px", border: "2px solid rgba(15,23,42,0.3)", borderTopColor: "#0F172A", borderRadius: "50%", animation: "spin 0.6s linear infinite" }} />
      ) : (
        icon
      )}
      {children}
    </button>
  );
};
