export interface Budget {
  id: string;
  user_id: string;
  client_name: string;
  annual_budget: number;
  reduced_budget?: number;
  budget_received_date?: string;
  budget_from?: string;
  created_at: string;
  updated_at: string;
}

export interface Expense {
  id: string;
  user_id: string;
  budget_id: string;
  date: string;
  comment: string;
  category: 'Payroll' | 'Mileage' | 'Extras' | 'Host Fee';
  cost: number;
  gst_status: 'Inc' | 'Excl';
  total: number;
  created_at: string;
  updated_at: string;
}

export interface BudgetSummary {
  client_name: string;
  annual_budget: number;
  total_spent: number;
  remaining: number;
  utilization_percentage: number;
}