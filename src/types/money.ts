export type TransactionType = 'income' | 'expense';

export type PaymentMethod = 'cash' | 'upi' | 'card' | 'bank' | 'other';

export type CategoryId =
  | 'food'
  | 'travel'
  | 'shopping'
  | 'bills'
  | 'recharge'
  | 'entertainment'
  | 'health'
  | 'education'
  | 'expense_other'
  | 'salary'
  | 'freelance'
  | 'business'
  | 'investment'
  | 'income_other';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  categoryId: CategoryId;
  categoryName: string;
  title: string;
  note: string;
  date: string; // ISO date YYYY-MM-DD
  paymentMethod: PaymentMethod | null;
  createdAt: string; // ISO datetime
  updatedAt: string; // ISO datetime
}

export interface CreateTransactionInput {
  type: TransactionType;
  amount: number;
  categoryId: CategoryId;
  title: string;
  note?: string;
  date: string;
  paymentMethod?: PaymentMethod | null;
}

export interface UpdateTransactionInput {
  type?: TransactionType;
  amount?: number;
  categoryId?: CategoryId;
  title?: string;
  note?: string;
  date?: string;
  paymentMethod?: PaymentMethod | null;
}

export type TransactionTypeFilter = 'all' | TransactionType;

export type DateRangeFilter = 'this_month' | 'last_month' | 'custom' | 'all';

export interface TransactionFilters {
  type: TransactionTypeFilter;
  dateRange: DateRangeFilter;
  categoryId: CategoryId | 'all';
  search: string;
  /** When dateRange is custom or month selector is used */
  month: number; // 0-11
  year: number;
}

export interface MoneySummary {
  balance: number;
  income: number;
  expense: number;
  monthlyBudget: number;
  remaining: number;
  spendingProgress: number;
  incomeChangePercent: number;
  expenseChangePercent: number;
}

export interface CategoryDefinition {
  id: CategoryId;
  name: string;
  type: TransactionType;
  iconKey: string;
  color: string;
  bgColor: string;
}
