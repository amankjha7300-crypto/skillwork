import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "./Button";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  actionHref?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionText,
  actionHref,
  onAction,
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 24px",
        textAlign: "center",
        backgroundColor: "#FFFFFF",
        borderRadius: "16px",
        border: "1px dashed #CBD5E1",
        margin: "16px 0",
      }}
    >
      <div
        style={{
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          backgroundColor: "#E0F2FE",
          color: "#0284C7",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "16px",
        }}
      >
        {icon || <Sparkles size={28} />}
      </div>
      <h4 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#0F172A", marginBottom: "8px" }}>
        {title}
      </h4>
      <p
        style={{
          color: "#64748B",
          fontSize: "0.95rem",
          maxWidth: "460px",
          lineHeight: 1.5,
          marginBottom: actionText ? "24px" : "0",
        }}
      >
        {description}
      </p>
      {actionText && actionHref && (
        <Link href={actionHref}>
          <Button variant="primary" icon={<ArrowRight size={18} />}>
            {actionText}
          </Button>
        </Link>
      )}
      {actionText && onAction && !actionHref && (
        <Button variant="primary" onClick={onAction} icon={<ArrowRight size={18} />}>
          {actionText}
        </Button>
      )}
    </div>
  );
};
