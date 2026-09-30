"use client";

import React, { useState } from "react";
import { Wallet, ArrowDownCircle, CheckCircle2, TrendingUp } from "lucide-react";
import { EarningsSummary as EarningsSummaryType } from "@/types/earnings";
import { formatINR } from "@/lib/utils";
import { Button } from "../common/Button";
import { Modal } from "../common/Modal";

interface EarningsSummaryProps {
  summary: EarningsSummaryType | null;
  onWithdraw: (amount: number, method: string, payoutDetails: string) => Promise<boolean>;
}

export const EarningsSummary: React.FC<EarningsSummaryProps> = ({ summary, onWithdraw }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [amount, setAmount] = useState<string>("2000");
  const [method, setMethod] = useState<string>("UPI");
  const [payoutDetails, setPayoutDetails] = useState<string>("aman@okaxis");
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const available = summary?.available_balance ?? 4970;
  const total = summary?.total_earned ?? 12450;
  const thisMonth = summary?.this_month ?? 5820;
  const pending = summary?.pending_clearance ?? 850;

  const handleWithdrawSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0 || num > available) {
      alert(`Please enter a valid amount up to ${formatINR(available)}.`);
      return;
    }

    setSubmitting(true);
    const ok = await onWithdraw(num, method, payoutDetails);
    setSubmitting(false);

    if (ok) {
      setSuccessMsg(`Successfully processed withdrawal of ${formatINR(num)} to ${method} (${payoutDetails}).`);
      setTimeout(() => {
        setSuccessMsg(null);
        setModalOpen(false);
      }, 2000);
    }
  };

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginBottom: "28px" }}>
        {/* Available Balance Card */}
        <div
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "16px",
            border: "2px solid #38BDF8",
            padding: "24px",
            boxShadow: "0 4px 12px rgba(56, 189, 248, 0.12)",
          }}
        >
          <div style={{ fontSize: "0.8rem", color: "#64748B", fontWeight: 600 }}>Available to Withdraw</div>
          <div style={{ fontSize: "2rem", fontWeight: 800, color: "#0F172A", margin: "6px 0 16px" }}>
            {formatINR(available)}
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setModalOpen(true)}
            icon={<ArrowDownCircle size={16} />}
            style={{ width: "100%" }}
          >
            Withdraw Balance
          </Button>
        </div>

        {/* Total Earned */}
        <div style={{ backgroundColor: "#FFFFFF", borderRadius: "16px", border: "1px solid #E2E8F0", padding: "24px" }}>
          <div style={{ fontSize: "0.8rem", color: "#64748B", fontWeight: 600 }}>Total Earnings</div>
          <div style={{ fontSize: "1.85rem", fontWeight: 800, color: "#0F172A", margin: "6px 0" }}>
            {formatINR(total)}
          </div>
          <div style={{ fontSize: "0.8rem", color: "#16A34A", display: "flex", alignItems: "center", gap: "4px" }}>
            <TrendingUp size={14} />
            {summary?.tasks_completed_count || 24} Tasks Completed
          </div>
        </div>

        {/* This Month */}
        <div style={{ backgroundColor: "#FFFFFF", borderRadius: "16px", border: "1px solid #E2E8F0", padding: "24px" }}>
          <div style={{ fontSize: "0.8rem", color: "#64748B", fontWeight: 600 }}>This Month</div>
          <div style={{ fontSize: "1.85rem", fontWeight: 800, color: "#0F172A", margin: "6px 0" }}>
            {formatINR(thisMonth)}
          </div>
          <div style={{ fontSize: "0.8rem", color: "#64748B" }}>
            Average: {formatINR(summary?.average_per_task || 820)} / task
          </div>
        </div>

        {/* Pending Clearance */}
        <div style={{ backgroundColor: "#FFFFFF", borderRadius: "16px", border: "1px solid #E2E8F0", padding: "24px" }}>
          <div style={{ fontSize: "0.8rem", color: "#64748B", fontWeight: 600 }}>Pending Review</div>
          <div style={{ fontSize: "1.85rem", fontWeight: 800, color: "#64748B", margin: "6px 0" }}>
            {formatINR(pending)}
          </div>
          <div style={{ fontSize: "0.8rem", color: "#B45309" }}>
            Releases upon deliverable approval
          </div>
        </div>
      </div>

      {/* Withdrawal Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Withdraw Earnings">
        {successMsg ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <CheckCircle2 size={44} color="#16A34A" style={{ margin: "0 auto 12px" }} />
            <p style={{ color: "#166534", fontWeight: 600, fontSize: "0.95rem" }}>{successMsg}</p>
          </div>
        ) : (
          <form onSubmit={handleWithdrawSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#0F172A", marginBottom: "6px" }}>
                Amount to Withdraw (Available: {formatINR(available)})
              </label>
              <input
                type="number"
                min="100"
                max={available}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "10px",
                  border: "1px solid #CBD5E1",
                  fontSize: "1.1rem",
                  fontWeight: 700,
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#0F172A", marginBottom: "6px" }}>
                Payout Method
              </label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "10px",
                  border: "1px solid #CBD5E1",
                  fontSize: "0.95rem",
                  backgroundColor: "#FFFFFF",
                }}
              >
                <option value="UPI">UPI ID (Instant Transfer)</option>
                <option value="BANK_TRANSFER">Bank Account (NEFT/IMPS)</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#0F172A", marginBottom: "6px" }}>
                {method === "UPI" ? "UPI Address (e.g. mobile@upi)" : "Account Number & IFSC"}
              </label>
              <input
                type="text"
                value={payoutDetails}
                onChange={(e) => setPayoutDetails(e.target.value)}
                required
                placeholder={method === "UPI" ? "username@upi" : "A/C: 123456789, IFSC: SBIN0001234"}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "10px",
                  border: "1px solid #CBD5E1",
                  fontSize: "0.95rem",
                }}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={submitting}
              style={{ width: "100%", marginTop: "8px" }}
            >
              Confirm Withdrawal
            </Button>
          </form>
        )}
      </Modal>
    </>
  );
};
