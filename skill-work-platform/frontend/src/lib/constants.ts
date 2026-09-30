export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export const THEME_COLORS = {
  primarySky: "#38BDF8",
  primarySkyHover: "#0EA5E9",
  primaryDark: "#0284C7",
  lightBlue: "#E0F2FE",
  background: "#F8FCFF",
  card: "#FFFFFF",
  mainText: "#0F172A",
  secondaryText: "#64748B",
  border: "#E2E8F0",
  success: "#16A34A",
  warning: "#F59E0B",
  error: "#EF4444"
};

export const WORKER_LEVELS = [
  { level: 1, title: "Beginner", dailyLimit: 1 },
  { level: 2, title: "Verified", dailyLimit: 2 },
  { level: 3, title: "Skilled", dailyLimit: 2 },
  { level: 4, title: "Advanced", dailyLimit: 3 },
  { level: 5, title: "Expert", dailyLimit: 4 },
];
