import type { AIAction, AIActionType } from '../../types/ai';
import type { CategoryId } from '../../types/money';
import { formatReminderDateLabel, formatReminderTime } from '../../utils/reminderDate';

export function createAIAction(
  type: AIActionType,
  options?: {
    payload?: Record<string, unknown>;
    label?: string;
    secondaryLabel?: string;
    status?: AIAction['status'];
  },
): AIAction {
  return {
    type,
    payload: options?.payload,
    label: options?.label,
    secondaryLabel: options?.secondaryLabel,
    status: options?.status ?? 'pending',
  };
}

export function getActionTitle(action: AIAction): string {
  const amount = typeof action.payload?.amount === 'number' ? action.payload.amount : null;
  const categoryName =
    typeof action.payload?.categoryName === 'string' ? action.payload.categoryName : null;
  const formatted =
    amount !== null ? `₹${amount.toLocaleString('en-IN')}` : null;

  switch (action.type) {
    case 'create_expense':
      return formatted && categoryName
        ? `Add ${formatted} ${categoryName} expense`
        : 'Add expense';
    case 'create_income':
      return formatted && categoryName
        ? `Add ${formatted} ${categoryName} income`
        : 'Add income';
    case 'show_spending':
      return 'View spending summary';
    case 'open_calculator': {
      const calcId = action.payload?.calculatorId ?? action.payload?.tool;
      const calcTitle =
        typeof calcId === 'string'
          ? calcId.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
          : 'Calculator';
      return `Open ${calcTitle}`;
    }
    case 'create_reminder': {
      const title = typeof action.payload?.title === 'string' ? action.payload.title : null;
      const date = typeof action.payload?.date === 'string' ? action.payload.date : null;
      const time = typeof action.payload?.time === 'string' ? action.payload.time : null;
      if (title && date && time) {
        return `${title}\n${formatReminderDateLabel(date)} · ${formatReminderTime(time)}`;
      }
      return 'Create Reminder';
    }
    case 'create_budget':
      return 'Create Budget';
    default:
      return 'Continue';
  }
}

export function getActionPrimaryLabel(action: AIAction): string {
  if (action.label) return action.label;

  switch (action.type) {
    case 'create_expense':
      return 'Confirm & Add';
    case 'create_income':
      return 'Confirm & Add';
    case 'show_spending':
      return 'Open Money';
    case 'open_calculator':
      return 'Open Calculator';
    case 'create_reminder':
      return 'Confirm & Create';
    case 'create_budget':
      return 'Create Budget';
    default:
      return 'Continue';
  }
}

export function resolveExpenseCategoryId(name: string): CategoryId {
  const key = name.trim().toLowerCase();
  const map: Record<string, CategoryId> = {
    food: 'food',
    dinner: 'food',
    lunch: 'food',
    grocery: 'food',
    groceries: 'food',
    travel: 'travel',
    uber: 'travel',
    cab: 'travel',
    shopping: 'shopping',
    clothes: 'shopping',
    bills: 'bills',
    bill: 'bills',
    electricity: 'bills',
    recharge: 'recharge',
    mobile: 'recharge',
    entertainment: 'entertainment',
    movie: 'entertainment',
    health: 'health',
    medical: 'health',
    education: 'education',
    other: 'expense_other',
  };
  return map[key] ?? 'expense_other';
}

export function resolveIncomeCategoryId(name: string): CategoryId {
  const key = name.trim().toLowerCase();
  const map: Record<string, CategoryId> = {
    salary: 'salary',
    freelance: 'freelance',
    business: 'business',
    investment: 'investment',
    other: 'income_other',
  };
  return map[key] ?? 'income_other';
}

export function resolveCategoryDisplayName(
  categoryId: CategoryId,
  fallback: string,
): string {
  const names: Record<CategoryId, string> = {
    food: 'Food',
    travel: 'Travel',
    shopping: 'Shopping',
    bills: 'Bills',
    recharge: 'Recharge',
    entertainment: 'Entertainment',
    health: 'Health',
    education: 'Education',
    expense_other: 'Other',
    salary: 'Salary',
    freelance: 'Freelance',
    business: 'Business',
    investment: 'Investment',
    income_other: 'Other',
  };
  return names[categoryId] ?? fallback;
}
