import React from "react";

export const LoadingState: React.FC<{ message?: string }> = ({ message = "Loading..." }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 20px",
        gap: "16px",
      }}
    >
      <div
        style={{
          width: "36px",
          height: "36px",
          border: "3px solid #E0F2FE",
          borderTopColor: "#38BDF8",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }}
      />
      <p style={{ color: "#64748B", fontSize: "0.95rem", fontWeight: 500 }}>{message}</p>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
