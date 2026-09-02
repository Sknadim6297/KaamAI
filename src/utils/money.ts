import type { MoneySummary, Transaction, TransactionFilters } from '../types/money';

export function formatCurrency(amount: number): string {
  return '₹' + Math.abs(amount).toLocaleString('en-IN');
}

export function formatCurrencySigned(amount: number, type: 'income' | 'expense'): string {
  const prefix = type === 'income' ? '+ ' : '− ';
  return prefix + formatCurrency(amount);
}

export function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function formatTransactionDate(iso: string, now = new Date()): string {
  const date = parseISODate(iso);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (isSameDay(date, today)) return 'Today';
  if (isSameDay(date, yesterday)) return 'Yesterday';

  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
  });
}

export function formatMonthLabel(month: number, year: number): string {
  const date = new Date(year, month, 1);
  return date.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
}

export function getMonthBounds(month: number, year: number): { start: string; end: string } {
  const start = toISODate(new Date(year, month, 1));
  const end = toISODate(new Date(year, month + 1, 0));
  return { start, end };
}

export function createId(): string {
  return `txn_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function filterTransactions(
  transactions: Transaction[],
  filters: TransactionFilters,
): Transaction[] {
  const { start, end } = getMonthBounds(filters.month, filters.year);
  const search = filters.search.trim().toLowerCase();

  return transactions
    .filter((txn) => {
      if (filters.type !== 'all' && txn.type !== filters.type) return false;

      if (filters.categoryId !== 'all' && txn.categoryId !== filters.categoryId) {
        return false;
      }

      if (filters.dateRange === 'this_month' || filters.dateRange === 'last_month') {
        if (txn.date < start || txn.date > end) return false;
      } else if (filters.dateRange === 'custom') {
        if (txn.date < start || txn.date > end) return false;
      }

      if (search) {
        const haystack = `${txn.title} ${txn.note} ${txn.categoryName}`.toLowerCase();
        if (!haystack.includes(search)) return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (a.date === b.date) {
        return b.createdAt.localeCompare(a.createdAt);
      }
      return b.date.localeCompare(a.date);
    });
}

export function computeSummary(
  transactions: Transaction[],
  month: number,
  year: number,
  monthlyBudget = 12000,
): MoneySummary {
  const { start, end } = getMonthBounds(month, year);

  let income = 0;
  let expense = 0;

  for (const txn of transactions) {
    if (txn.date < start || txn.date > end) continue;
    if (txn.type === 'income') income += txn.amount;
    else expense += txn.amount;
  }

  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  const prev = getMonthBounds(prevMonth, prevYear);

  let prevIncome = 0;
  let prevExpense = 0;
  for (const txn of transactions) {
    if (txn.date < prev.start || txn.date > prev.end) continue;
    if (txn.type === 'income') prevIncome += txn.amount;
    else prevExpense += txn.amount;
  }

  const incomeChangePercent =
    prevIncome === 0 ? (income > 0 ? 100 : 0) : Math.round(((income - prevIncome) / prevIncome) * 100);
  const expenseChangePercent =
    prevExpense === 0
      ? expense > 0
        ? 100
        : 0
      : Math.round(((expense - prevExpense) / prevExpense) * 100);

  const remaining = Math.max(monthlyBudget - expense, 0);
  const spendingProgress = monthlyBudget > 0 ? Math.min(expense / monthlyBudget, 1) : 0;

  return {
    balance: income - expense,
    income,
    expense,
    monthlyBudget,
    remaining,
    spendingProgress,
    incomeChangePercent,
    expenseChangePercent,
  };
}

export type ListSection =
  | { type: 'header'; title: string; key: string }
  | { type: 'transaction'; transaction: Transaction; key: string };

export function groupTransactionsForList(transactions: Transaction[]): ListSection[] {
  const sections: ListSection[] = [];
  let lastLabel = '';

  for (const txn of transactions) {
    const label = formatTransactionDate(txn.date).toUpperCase();
    if (label !== lastLabel) {
      sections.push({ type: 'header', title: label, key: `header_${txn.date}` });
      lastLabel = label;
    }
    sections.push({ type: 'transaction', transaction: txn, key: txn.id });
  }

  return sections;
}

export function parseAmountInput(value: string): number | null {
  const cleaned = value.replace(/[₹,\s]/g, '').trim();
  if (!cleaned) return null;
  if (!/^\d+(\.\d{0,2})?$/.test(cleaned)) return null;
  const num = Number(cleaned);
  if (!Number.isFinite(num) || num <= 0) return null;
  return num;
}
