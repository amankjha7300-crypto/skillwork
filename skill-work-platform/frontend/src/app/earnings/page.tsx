"use client";

import React, { useState, useEffect } from "react";
import { Wallet, ArrowDownCircle, RefreshCw } from "lucide-react";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/layout/PageHeader";
import { EarningsSummary } from "@/components/earnings/EarningsSummary";
import { TransactionTable } from "@/components/earnings/TransactionTable";
import { LoadingState } from "@/components/common/LoadingState";
import { EarningsSummary as EarningsSummaryType, Transaction } from "@/types/earnings";

export default function EarningsPage() {
  const [summary, setSummary] = useState<EarningsSummaryType | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEarningsData = async () => {
    setLoading(true);
    try {
      const [sum, txns] = await Promise.all([
        api.getEarnings(),
        api.getTransactions(),
      ]);
      setSummary(sum);
      setTransactions(txns);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEarningsData();
  }, []);

  const handleWithdraw = async (amount: number, method: string, payoutDetails: string) => {
    try {
      await api.withdraw({ amount, method, payout_details: payoutDetails });
      await fetchEarningsData();
      return true;
    } catch (err: any) {
      alert(err.message || "Failed to process withdrawal.");
      return false;
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
      <PageHeader
        title="Earnings & Payouts"
        subtitle="Transparent ledger of your completed tasks, verified rewards, and instant withdrawals."
      />

      {loading ? (
        <LoadingState message="Loading your earnings history..." />
      ) : (
        <>
          <EarningsSummary summary={summary} onWithdraw={handleWithdraw} />

          {/* Transaction History Section */}
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "16px",
              border: "1px solid #E2E8F0",
              padding: "24px",
              boxShadow: "0 2px 4px rgba(15, 23, 42, 0.04)",
            }}
          >
            <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#0F172A", marginBottom: "16px" }}>
              Transaction History
            </h3>
            <TransactionTable transactions={transactions} />
          </div>
        </>
      )}
    </div>
  );
}
