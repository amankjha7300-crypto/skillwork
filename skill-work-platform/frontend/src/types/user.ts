export interface User {
  id: number;
  full_name: string;
  email: string;
  phone_number?: string;
  is_verified: boolean;
  created_at: string;
}

export interface WorkerLevel {
  id: number;
  level_number: number;
  title: string;
  min_tasks_required: number;
  min_completion_rate: number;
  min_rating: number;
  daily_limit: number;
  badge_name: string;
}

export interface WorkerAvailability {
  is_available: boolean;
  available_skills_filter?: string;
  auto_notify: boolean;
  updated_at: string;
}

export interface WorkerPerformance {
  tasks_completed: number;
  tasks_assigned: number;
  completion_rate: number;
  on_time_delivery_rate: number;
  average_rating: number;
  quality_score: number;
  reliability_score: number;
  overall_performance_score: number;
}

export interface PortfolioItem {
  id: number;
  title: string;
  description?: string;
  project_url?: string;
  skills_used?: string;
  created_at: string;
}

export interface WorkHistory {
  id: number;
  company_or_client: string;
  role: string;
  duration?: string;
  description?: string;
  created_at: string;
}

export interface WorkerProfile {
  id: number;
  user_id: number;
  user: User;
  headline: string;
  bio?: string;
  location: string;
  avatar_url?: string;
  education?: string;
  experience_years: number;
  daily_task_limit: number;
  onboarding_completed: boolean;
  onboarding_step: number;
  is_verified_badge: boolean;
  github_url?: string;
  linkedin_url?: string;
  portfolio_url?: string;
  level?: WorkerLevel;
  availability?: WorkerAvailability;
  performance?: WorkerPerformance;
  skills: any[];
  portfolio_items: PortfolioItem[];
  work_history: WorkHistory[];
  today_tasks_count?: number;
}
