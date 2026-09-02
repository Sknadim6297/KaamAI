import type { CalculatorDefinition } from '../types/calculator';

export const CALCULATORS: CalculatorDefinition[] = [
  {
    id: 'emi',
    title: 'EMI Calculator',
    description: 'Plan your monthly loan payment',
    category: 'Finance',
    iconKey: 'landmark',
    keywords: ['emi', 'loan', 'mortgage', 'finance'],
  },
  {
    id: 'percentage',
    title: 'Percentage Calculator',
    description: 'Find percentages quickly',
    category: 'Utility',
    iconKey: 'percent',
    keywords: ['percentage', 'percent', 'ratio'],
  },
  {
    id: 'discount',
    title: 'Discount Calculator',
    description: 'Calculate savings on discounts',
    category: 'Money',
    iconKey: 'tag',
    keywords: ['discount', 'sale', 'offer'],
  },
  {
    id: 'gst',
    title: 'GST Calculator',
    description: 'Add or remove GST easily',
    category: 'Money',
    iconKey: 'receipt',
    keywords: ['gst', 'tax', 'vat'],
  },
  {
    id: 'age',
    title: 'Age Calculator',
    description: 'Calculate exact age from dates',
    category: 'Utility',
    iconKey: 'calendar',
    keywords: ['age', 'birthday', 'dob'],
  },
  {
    id: 'bmi',
    title: 'BMI Calculator',
    description: 'Estimate body mass index',
    category: 'Health',
    iconKey: 'heart-pulse',
    keywords: ['bmi', 'health', 'weight', 'height'],
  },
  {
    id: 'sip',
    title: 'SIP Calculator',
    description: 'Estimate mutual fund SIP returns',
    category: 'Finance',
    iconKey: 'trending-up',
    keywords: ['sip', 'investment', 'mutual fund'],
  },
  {
    id: 'fd',
    title: 'FD Calculator',
    description: 'Estimate fixed deposit maturity',
    category: 'Finance',
    iconKey: 'piggy-bank',
    keywords: ['fd', 'fixed deposit', 'savings'],
  },
  {
    id: 'salary',
    title: 'Salary Calculator',
    description: 'Estimate in-hand salary',
    category: 'Money',
    iconKey: 'wallet',
    keywords: ['salary', 'ctc', 'in-hand', 'payroll'],
  },
  {
    id: 'split-bill',
    title: 'Split Bill Calculator',
    description: 'Split bills with tip & discount',
    category: 'Money',
    iconKey: 'users',
    keywords: ['split', 'bill', 'tip', 'share'],
  },
  {
    id: 'date-difference',
    title: 'Date Difference',
    description: 'Days between two dates',
    category: 'Utility',
    iconKey: 'calendar-range',
    keywords: ['date', 'difference', 'days'],
  },
  {
    id: 'fuel-cost',
    title: 'Fuel Cost Calculator',
    description: 'Estimate trip fuel expense',
    category: 'Utility',
    iconKey: 'fuel',
    keywords: ['fuel', 'petrol', 'diesel', 'mileage'],
  },
];

export const CALCULATOR_CATEGORIES = ['All', 'Money', 'Finance', 'Health', 'Utility'] as const;

export type CalculatorCategoryFilter = (typeof CALCULATOR_CATEGORIES)[number];

export function getCalculatorById(id: string): CalculatorDefinition | undefined {
  return CALCULATORS.find((c) => c.id === id);
}

export function getCalculatorRoute(id: string): string {
  return `/tools/${id}`;
}

export function getCalculatorNavigationPath(payload?: Record<string, unknown>): string {
  const id = resolveCalculatorIdFromPayload(payload);
  if (id && getCalculatorById(id)) {
    return getCalculatorRoute(id);
  }
  return '/(tabs)/tools';
}

export function resolveCalculatorIdFromPayload(payload?: Record<string, unknown>): string | null {
  if (!payload) return null;
  const id = payload.calculatorId ?? payload.tool;
  return typeof id === 'string' ? id : null;
}

export function resolveCalculatorIdFromText(text: string): string | null {
  const lower = text.toLowerCase();
  if (lower.includes('emi') || lower.includes('loan')) return 'emi';
  if (lower.includes('discount')) return 'discount';
  if (lower.includes('gst')) return 'gst';
  if (lower.includes('bmi')) return 'bmi';
  if (lower.includes('sip')) return 'sip';
  if (lower.includes('fd') || lower.includes('fixed deposit')) return 'fd';
  if (lower.includes('salary') || lower.includes('in-hand')) return 'salary';
  if (lower.includes('split') && lower.includes('bill')) return 'split-bill';
  if (lower.includes('fuel') || lower.includes('mileage')) return 'fuel-cost';
  if (lower.includes('age') || lower.includes('birthday')) return 'age';
  if (lower.includes('date') && lower.includes('difference')) return 'date-difference';
  if (lower.includes('percentage') || lower.includes('percent')) return 'percentage';
  if (lower.includes('calculat')) return 'emi';
  return null;
}
