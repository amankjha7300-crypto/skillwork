"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "./useAuth";

export function useAvailability() {
  const { profile, refreshProfile } = useAuth();
  const [updating, setUpdating] = useState(false);

  const isAvailable = profile?.availability?.is_available ?? true;

  const toggleAvailability = async () => {
    setUpdating(true);
    try {
      await api.updateAvailability({
        is_available: !isAvailable,
      });
      await refreshProfile();
    } catch (err) {
      console.error("Failed to toggle availability", err);
    } finally {
      setUpdating(false);
    }
  };

  return {
    isAvailable,
    updating,
    toggleAvailability,
  };
}
