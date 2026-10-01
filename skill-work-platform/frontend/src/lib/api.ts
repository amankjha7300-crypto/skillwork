import { API_BASE_URL } from "./constants";
import { getStoredToken } from "./auth";
import { handleMockApiRequest } from "./mockApi";

function shouldDirectlyUseMock(): boolean {
  if (typeof window === "undefined") return false;
  // If we are on HTTPS (e.g. Vercel) and the API base URL is an insecure HTTP URL (e.g. http://localhost:8000),
  // modern browsers strictly block it with Mixed Active Content security errors.
  if (window.location.protocol === "https:" && API_BASE_URL.startsWith("http://")) {
    return true;
  }
  return false;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  // If running in HTTPS demo environment where localhost:8000 is blocked:
  if (shouldDirectlyUseMock()) {
    return handleMockApiRequest(endpoint, options);
  }

  const token = getStoredToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const errorMsg = data.detail || "An unexpected error occurred. Please try again.";
      const error = new Error(errorMsg);
      (error as any).isHttpError = true;
      throw error;
    }

    return data as T;
  } catch (err: any) {
    if (err?.isHttpError) {
      throw err;
    }
    // If backend is offline, unreachable, or fetch failed (e.g. "Failed to fetch"):
    // Automatically fall back to the mock store so user flows are never blocked!
    console.warn(`[SkillWork API] Network fetch failed (${err?.message || "unreachable"}). Activating in-browser mock engine for: ${endpoint}`);
    return handleMockApiRequest(endpoint, options);
  }
}

export const api = {
  // Auth
  register: (body: any) => request<any>("/auth/register", { method: "POST", body: JSON.stringify(body) }),
  login: (body: any) => request<any>("/auth/login", { method: "POST", body: JSON.stringify(body) }),
  getMe: () => request<any>("/auth/me"),

  // Worker Profile & Availability
  getProfile: () => request<any>("/worker/profile"),
  updateProfile: (body: any) => request<any>("/worker/profile", { method: "PATCH", body: JSON.stringify(body) }),
  updateAvailability: (body: { is_available: boolean; available_skills_filter?: number[]; auto_notify?: boolean }) =>
    request<any>("/worker/availability", { method: "PATCH", body: JSON.stringify(body) }),
  addPortfolio: (body: any) => request<any>("/worker/portfolio", { method: "POST", body: JSON.stringify(body) }),
  addWorkHistory: (body: any) => request<any>("/worker/history", { method: "POST", body: JSON.stringify(body) }),

  // Skills & Assessments
  listSkills: (category?: string) => request<any[]>(`/skills${category ? `?category=${encodeURIComponent(category)}` : ""}`),
  getWorkerSkills: () => request<any[]>("/skills/worker"),
  saveWorkerSkill: (body: { skill_id: number; proficiency_percentage?: number; level_tier?: string }) =>
    request<any>("/skills/worker", { method: "POST", body: JSON.stringify(body) }),
  getAssessment: (skillId: number) => request<any>(`/skills/${skillId}/assessment`),
  submitAssessment: (body: { assessment_id: number; answers: number[] }) =>
    request<any>("/skills/assessment", { method: "POST", body: JSON.stringify(body) }),
  getRecommendations: () => request<any[]>("/skills/recommendations"),

  // Work & Grab
  getAvailableWork: () => request<any[]>("/work"),
  getWorkDetails: (taskId: number) => request<any>(`/work/${taskId}`),
  grabWork: (taskId: number) => request<any>(`/work/${taskId}/grab`, { method: "POST" }),

  // My Tasks
  getMyTasks: (status?: string) => request<any[]>(`/tasks${status ? `?status=${status}` : ""}`),
  getTaskAssignment: (assignmentId: number) => request<any>(`/tasks/${assignmentId}`),
  startTask: (assignmentId: number) => request<any>(`/tasks/${assignmentId}/start`, { method: "POST" }),
  submitTask: (assignmentId: number, body: { submission_notes?: string; files: any[] }) =>
    request<any>(`/tasks/${assignmentId}/submit`, { method: "POST", body: JSON.stringify(body) }),

  // Earnings & Withdrawals
  getEarnings: () => request<any>("/earnings"),
  getTransactions: () => request<any[]>("/earnings/transactions"),
  withdraw: (body: { amount: number; method: string; payout_details: string }) =>
    request<any>("/earnings/withdraw", { method: "POST", body: JSON.stringify(body) }),
  getWithdrawals: () => request<any[]>("/earnings/withdrawals"),

  // Performance
  getPerformance: () => request<any>("/performance"),
  getLevel: () => request<any>("/performance/level"),

  // Notifications
  getNotifications: () => request<any[]>("/notifications"),
  markNotificationRead: (id: number) => request<any>(`/notifications/${id}/read`, { method: "POST" }),
  markAllNotificationsRead: () => request<any>("/notifications/read-all", { method: "POST" }),
};
