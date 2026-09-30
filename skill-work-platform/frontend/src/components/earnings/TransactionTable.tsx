import React from "react";
import { Transaction } from "@/types/earnings";
import { formatINR, formatDate } from "@/lib/utils";

export const TransactionTable: React.FC<{ transactions: Transaction[] }> = ({ transactions }) => {
  if (transactions.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "32px", color: "#64748B", fontSize: "0.9rem" }}>
        No transactions recorded yet.
      </div>
    );
  }

  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid #E2E8F0" }}>
            <th style={{ padding: "12px 16px", fontSize: "0.8rem", color: "#64748B", fontWeight: 700, textTransform: "uppercase" }}>Date</th>
            <th style={{ padding: "12px 16px", fontSize: "0.8rem", color: "#64748B", fontWeight: 700, textTransform: "uppercase" }}>Description</th>
            <th style={{ padding: "12px 16px", fontSize: "0.8rem", color: "#64748B", fontWeight: 700, textTransform: "uppercase" }}>Reference</th>
            <th style={{ padding: "12px 16px", fontSize: "0.8rem", color: "#64748B", fontWeight: 700, textTransform: "uppercase" }}>Amount</th>
            <th style={{ padding: "12px 16px", fontSize: "0.8rem", color: "#64748B", fontWeight: 700, textTransform: "uppercase" }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => {
            const isCredit = t.amount > 0;

            return (
              <tr key={t.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                <td style={{ padding: "14px 16px", fontSize: "0.88rem", color: "#475569" }}>
                  {formatDate(t.created_at)}
                </td>
                <td style={{ padding: "14px 16px", fontSize: "0.92rem", fontWeight: 600, color: "#0F172A" }}>
                  {t.title}
                </td>
                <td style={{ padding: "14px 16px", fontSize: "0.8rem", color: "#64748B", fontFamily: "monospace" }}>
                  {t.reference_id}
                </td>
                <td style={{ padding: "14px 16px", fontSize: "0.95rem", fontWeight: 700, color: isCredit ? "#16A34A" : "#0F172A" }}>
                  {isCredit ? `+${formatINR(t.amount)}` : formatINR(t.amount)}
                </td>
                <td style={{ padding: "14px 16px" }}>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      padding: "2px 8px",
                      borderRadius: "6px",
                      backgroundColor: t.status === "PAID" ? "#DCFCE7" : "#FEF3C7",
                      color: t.status === "PAID" ? "#16A34A" : "#B45309",
                    }}
                  >
                    {t.status}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
