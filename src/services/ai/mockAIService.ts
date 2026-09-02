import type {
  AIContextData,
  AIResponse,
  AIService,
} from '../../types/ai';
import {
  createAIAction,
  resolveCategoryDisplayName,
  resolveExpenseCategoryId,
  resolveIncomeCategoryId,
} from './aiActions';
import { resolveCalculatorIdFromText } from '../../constants/calculators';
import { parseReminderIntent } from './reminderParser';
import { formatReminderDateLabel, formatReminderTime } from '../../utils/reminderDate';

function calculatorAction(message: string, label: string, calculatorId: string) {
  return createAIAction('open_calculator', {
    label,
    status: 'info',
    payload: { calculatorId },
  });
}

function calculatorActionFromText(text: string) {
  const id = resolveCalculatorIdFromText(text) ?? 'emi';
  const labels: Record<string, string> = {
    emi: 'Open EMI Calculator',
    discount: 'Open Discount Calculator',
    gst: 'Open GST Calculator',
    bmi: 'Open BMI Calculator',
    sip: 'Open SIP Calculator',
    fd: 'Open FD Calculator',
    salary: 'Open Salary Calculator',
    'split-bill': 'Open Split Bill Calculator',
    'date-difference': 'Open Date Difference Calculator',
    'fuel-cost': 'Open Fuel Cost Calculator',
    percentage: 'Open Percentage Calculator',
    age: 'Open Age Calculator',
  };
  return calculatorAction(text, labels[id] ?? 'Open Calculator', id);
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomDelay(): Promise<void> {
  return delay(500 + Math.floor(Math.random() * 400));
}

function extractAmount(text: string): number | null {
  const match = text.match(/(?:₹\s*)?(\d+(?:,\d{3})*(?:\.\d{1,2})?)/);
  if (!match) return null;
  const value = Number(match[1].replace(/,/g, ''));
  return Number.isFinite(value) && value > 0 ? value : null;
}

function extractExpenseCategory(text: string): string {
  const categories = [
    'food',
    'dinner',
    'lunch',
    'travel',
    'uber',
    'shopping',
    'bills',
    'electricity',
    'recharge',
    'entertainment',
    'health',
    'education',
  ];
  for (const cat of categories) {
    if (text.includes(cat)) return cat;
  }
  return 'other';
}

function extractIncomeCategory(text: string): string {
  const categories = ['salary', 'freelance', 'business', 'investment'];
  for (const cat of categories) {
    if (text.includes(cat)) return cat;
  }
  return 'salary';
}

function formatINR(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

export class MockAIService implements AIService {
  async sendMessage(message: string, context?: AIContextData): Promise<AIResponse> {
    await randomDelay();

    const trimmed = message.trim();
    if (!trimmed) {
      return {
        message: 'Please type a message so I can help.',
      };
    }

    const lower = trimmed.toLowerCase();

    try {
      // Spending query
      if (
        lower.includes('how much') &&
        (lower.includes('spend') || lower.includes('spent') || lower.includes('expense'))
      ) {
        const expense = context?.money?.expenseThisMonth ?? 0;
        const count = context?.money?.expenseCountThisMonth ?? 0;
        return {
          message:
            count === 0
              ? "You haven't recorded any expenses this month yet."
              : `You've spent ${formatINR(expense)} this month across ${count} transaction${count === 1 ? '' : 's'}.`,
          action: createAIAction('show_spending', {
            label: 'Open Money',
            status: 'info',
            payload: { expense, count },
          }),
        };
      }

      if (
        lower.includes('show') &&
        (lower.includes('spend') || lower.includes('expense') || lower.includes('money'))
      ) {
        const expense = context?.money?.expenseThisMonth ?? 0;
        return {
          message: `Here's your spending overview. This month's expenses total ${formatINR(expense)}.`,
          action: createAIAction('show_spending', {
            label: 'Open Money',
            status: 'info',
          }),
        };
      }

      // EMI / calculator
      if (lower.includes('emi') || lower.includes('calculate emi') || lower.includes('loan')) {
        return {
          message:
            'I can help with EMI calculations. Open the calculator to compute your monthly EMI.',
          action: calculatorActionFromText(trimmed),
        };
      }

      if (lower.includes('gst')) {
        return {
          message: 'I can help you add or remove GST from an amount.',
          action: calculatorAction(trimmed, 'Open GST Calculator', 'gst'),
        };
      }

      if (lower.includes('bmi')) {
        return {
          message: 'Open the BMI calculator to estimate your body mass index.',
          action: calculatorAction(trimmed, 'Open BMI Calculator', 'bmi'),
        };
      }

      if (lower.includes('sip')) {
        return {
          message: 'Estimate your SIP returns with the SIP calculator.',
          action: calculatorAction(trimmed, 'Open SIP Calculator', 'sip'),
        };
      }

      // Discount calc (informational + calculator)
      if (lower.includes('discount')) {
        const amount = extractAmount(lower);
        const percentMatch = lower.match(/(\d+(?:\.\d+)?)\s*%/);
        if (amount && percentMatch) {
          const percent = Number(percentMatch[1]);
          const saved = Math.round((amount * percent) / 100);
          const finalPrice = amount - saved;
          return {
            message: `${percent}% off ${formatINR(amount)} saves ${formatINR(saved)}. Final price: ${formatINR(finalPrice)}.`,
            action: calculatorAction(trimmed, 'Open Discount Calculator', 'discount'),
          };
        }
        return {
          message: 'Share an amount and percentage — for example, "Calculate 20% discount on ₹2500".',
          action: calculatorAction(trimmed, 'Open Discount Calculator', 'discount'),
        };
      }

      // Reminder
      if (lower.includes('remind') || lower.includes('reminder')) {
        const parsed = parseReminderIntent(trimmed);
        const dateLabel = formatReminderDateLabel(parsed.date);
        const timeLabel = formatReminderTime(parsed.time);

        return {
          message: `Sure. I can remind you to ${parsed.title.toLowerCase()} ${dateLabel.toLowerCase()} at ${timeLabel}.`,
          action: createAIAction('create_reminder', {
            label: 'Confirm & Create',
            secondaryLabel: 'Cancel',
            status: 'pending',
            payload: {
              title: parsed.title,
              note: '',
              date: parsed.date,
              time: parsed.time,
              categoryId: parsed.categoryId,
              categoryName: parsed.categoryName,
              type: parsed.type,
              priority: parsed.priority,
              recurrence: parsed.recurrence,
            },
          }),
        };
      }

      // Budget
      if (lower.includes('budget')) {
        const amount = extractAmount(lower);
        return {
          message: amount
            ? `Let's create a monthly budget of ${formatINR(amount)}.`
            : "Let's create a monthly budget.",
          action: createAIAction('create_budget', {
            label: 'Create Budget',
            status: 'info',
            payload: amount ? { amount } : undefined,
          }),
        };
      }

      // Income
      if (
        lower.includes('salary') ||
        lower.includes('income') ||
        (lower.includes('add') && (lower.includes('earned') || lower.includes('received')))
      ) {
        const amount = extractAmount(lower);
        const rawCategory = extractIncomeCategory(lower);
        const categoryId = resolveIncomeCategoryId(rawCategory);
        const categoryName = resolveCategoryDisplayName(categoryId, 'Salary');

        if (amount) {
          return {
            message: `I can add ${formatINR(amount)} as ${categoryName} income.`,
            action: createAIAction('create_income', {
              label: 'Confirm & Add',
              secondaryLabel: 'Cancel',
              status: 'pending',
              payload: {
                amount,
                categoryId,
                categoryName,
                title: categoryName,
                note: '',
              },
            }),
          };
        }

        return {
          message: 'Tell me the income amount — for example, "Add salary 16000".',
        };
      }

      // Expense
      if (
        lower.includes('expense') ||
        lower.includes('spend') ||
        lower.includes('spent') ||
        lower.includes('track') ||
        (lower.includes('add') && extractAmount(lower) !== null)
      ) {
        const amount = extractAmount(lower);
        const rawCategory = extractExpenseCategory(lower);
        const categoryId = resolveExpenseCategoryId(rawCategory);
        const categoryName = resolveCategoryDisplayName(categoryId, 'Other');

        if (amount) {
          return {
            message: `Sure. I can add a ${formatINR(amount)} ${categoryName} expense for you.`,
            action: createAIAction('create_expense', {
              label: 'Confirm & Add',
              secondaryLabel: 'Cancel',
              status: 'pending',
              payload: {
                amount,
                categoryId,
                categoryName,
                title: categoryName,
                note: '',
              },
            }),
          };
        }

        return {
          message: 'Tell me the amount and category — for example, "Add expense 450 food".',
        };
      }

      // Calculator general
      if (lower.includes('calculat') || lower.includes('math')) {
        return {
          message: 'I can help with EMI, discounts, GST, and quick calculations.',
          action: calculatorActionFromText(trimmed),
        };
      }

      return {
        message:
          'I can help with money tracking, reminders, calculations, budgets, and everyday tasks. Try asking me something specific.',
      };
    } catch {
      return {
        message: 'Something went wrong. Please try again.',
      };
    }
  }
}

export const mockAIService = new MockAIService();
