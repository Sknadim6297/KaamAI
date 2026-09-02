export type AIMessageRole = 'user' | 'assistant' | 'system';

export type AIActionType =
  | 'create_expense'
  | 'create_income'
  | 'show_spending'
  | 'open_calculator'
  | 'create_reminder'
  | 'create_budget';

export type AIActionStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'info';

export interface AIAction {
  type: AIActionType;
  payload?: Record<string, unknown>;
  label?: string;
  secondaryLabel?: string;
  status?: AIActionStatus;
}

export interface AIMessage {
  id: string;
  role: AIMessageRole;
  content: string;
  timestamp: string;
  action?: AIAction;
}

export interface AIResponse {
  message: string;
  action?: AIAction;
}

export interface AIMoneySnapshot {
  expenseThisMonth: number;
  incomeThisMonth: number;
  balanceThisMonth: number;
  expenseCountThisMonth: number;
  incomeCountThisMonth: number;
}

export interface AIContextData {
  money?: AIMoneySnapshot;
}

export interface AIService {
  sendMessage(message: string, context?: AIContextData): Promise<AIResponse>;
}
