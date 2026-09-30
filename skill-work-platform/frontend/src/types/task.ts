import { Skill } from "./skill";

export interface TaskRequirement {
  id: number;
  skill_id: number;
  skill: Skill;
  min_proficiency: number;
  min_level_tier: string;
  is_mandatory: boolean;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  category: string;
  payment_amount: number;
  currency: string;
  estimated_time: string;
  deadline_hours: number;
  total_slots: number;
  available_slots: number;
  status: "AVAILABLE" | "ASSIGNED" | "IN_PROGRESS" | "SUBMITTED" | "COMPLETED" | "EXPIRED" | "CANCELLED";
  urgency: "NORMAL" | "HIGH" | "CRITICAL";
  expires_at?: string;
  current_notification_tier: number;
  instructions?: string;
  expected_output?: string;
  submission_rules?: string;
  reference_files_json?: string;
  created_at: string;
  requirements: TaskRequirement[];
  is_eligible?: boolean;
  eligibility_reason?: string;
}

export interface TaskAssignment {
  id: number;
  task_id: number;
  task: Task;
  worker_id: number;
  status: "ASSIGNED" | "IN_PROGRESS" | "SUBMITTED" | "UNDER_REVIEW" | "NEEDS_CHANGES" | "APPROVED" | "COMPLETED";
  assigned_at: string;
  started_at?: string;
  due_at?: string;
  completed_at?: string;
  earnings_processed: boolean;
}

export interface GrabWorkResponse {
  success: boolean;
  message: string;
  assignment_id?: number;
  task?: Task;
  today_tasks_count?: number;
  daily_limit?: number;
}
