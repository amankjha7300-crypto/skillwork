"use client";

import { useState, useEffect, createContext, useContext } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { getStoredToken, setStoredToken, removeStoredToken, getStoredUser, setStoredUser } from "@/lib/auth";
import { User, WorkerProfile } from "@/types/user";

interface AuthContextType {
  user: User | null;
  profile: WorkerProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (fullName: string, email: string, password: string, phone?: string) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<WorkerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const refreshProfile = async () => {
    try {
      const p = await api.getProfile();
      setProfile(p);
      setUser(p.user);
      setStoredUser(p.user);
    } catch (e) {
      console.error("Failed to load worker profile", e);
    }
  };

  useEffect(() => {
    const token = getStoredToken();
    if (token) {
      refreshProfile().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.login({ email, password });
    setStoredToken(res.access_token);
    setUser(res.user);
    setStoredUser(res.user);
    await refreshProfile();
    router.push("/dashboard");
  };

  const register = async (fullName: string, email: string, password: string, phone?: string) => {
    const res = await api.register({ full_name: fullName, email, password, phone_number: phone });
    setStoredToken(res.access_token);
    setUser(res.user);
    setStoredUser(res.user);
    await refreshProfile();
    router.push("/onboarding");
  };

  const logout = () => {
    removeStoredToken();
    setUser(null);
    setProfile(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, login, register, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
