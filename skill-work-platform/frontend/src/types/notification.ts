export interface AppNotification {
  id: number;
  user_id: number;
  task_id?: number;
  type: string;
  title: string;
  message: string;
  priority: "HIGH" | "NORMAL" | "LOW";
  is_read: boolean;
  action_url?: string;
  data_json?: string;
  created_at: string;
}
