export interface EarningsSummary {
  total_earned: number;
  this_month: number;
  pending_clearance: number;
  available_balance: number;
  withdrawn_total: number;
  tasks_completed_count: number;
  average_per_task: number;
  this_week: number;
}

export interface Transaction {
  id: number;
  task_id?: number;
  amount: number;
  type: string;
  title: string;
  status: string;
  reference_id: string;
  created_at: string;
}

export interface Withdrawal {
  id: number;
  amount: number;
  method: string;
  payout_details: string;
  status: string;
  reference_id: string;
  requested_at: string;
  processed_at?: string;
}
