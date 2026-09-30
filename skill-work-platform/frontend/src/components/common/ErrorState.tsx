import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "./Button";

export const ErrorState: React.FC<{ message: string; onRetry?: () => void }> = ({
  message,
  onRetry,
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 24px",
        backgroundColor: "#FEF2F2",
        borderRadius: "16px",
        border: "1px solid #FECACA",
        textAlign: "center",
        margin: "16px 0",
      }}
    >
      <AlertCircle size={36} color="#EF4444" style={{ marginBottom: "12px" }} />
      <h4 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#991B1B", marginBottom: "6px" }}>
        Unable to load data
      </h4>
      <p style={{ color: "#B91C1C", fontSize: "0.9rem", marginBottom: onRetry ? "18px" : "0" }}>
        {message}
      </p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} icon={<RefreshCw size={14} />}>
          Try Again
        </Button>
      )}
    </div>
  );
};
