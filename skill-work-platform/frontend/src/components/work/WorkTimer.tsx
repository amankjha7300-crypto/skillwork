"use client";

import React, { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { getTimeRemaining } from "@/lib/utils";

export const WorkTimer: React.FC<{ expiresAt?: string; onExpire?: () => void }> = ({
  expiresAt,
  onExpire,
}) => {
  const [timeLeft, setTimeLeft] = useState<{ formatted: string; isExpired: boolean; seconds: number }>({
    formatted: "00:47",
    isExpired: false,
    seconds: 47,
  });

  useEffect(() => {
    if (!expiresAt) return;

    const update = () => {
      const remaining = getTimeRemaining(expiresAt);
      setTimeLeft(remaining);
      if (remaining.isExpired && onExpire) {
        onExpire();
      }
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [expiresAt, onExpire]);

  const isCritical = timeLeft.seconds < 60 && !timeLeft.isExpired;

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "4px 10px",
        borderRadius: "8px",
        backgroundColor: isCritical ? "#FEE2E2" : "#E0F2FE",
        color: isCritical ? "#DC2626" : "#0284C7",
        fontSize: "0.85rem",
        fontWeight: 700,
        fontVariantNumeric: "tabular-nums",
      }}
    >
      <Clock size={14} className={isCritical ? "animate-pulse" : ""} />
      <span>{timeLeft.isExpired ? "Expired" : `Available for: ${timeLeft.formatted}`}</span>
    </div>
  );
};
