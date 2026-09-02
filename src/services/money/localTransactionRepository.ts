import { getCategoryById } from '../../constants/categories';
import type {
  CreateTransactionInput,
  Transaction,
  UpdateTransactionInput,
} from '../../types/money';
import { createId, toISODate } from '../../utils/money';
import type { TransactionRepository } from './transactionRepository';

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return toISODate(d);
}

function buildSeed(): Transaction[] {
  const now = new Date().toISOString();
  const seeds: Array<Omit<Transaction, 'categoryName'> & { categoryName?: string }> = [
    {
      id: 'txn_seed_1',
      type: 'expense',
      amount: 450,
      categoryId: 'food',
      title: 'Dinner',
      note: 'Dinner with friends',
      date: daysAgo(0),
      paymentMethod: 'upi',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'txn_seed_2',
      type: 'income',
      amount: 16000,
      categoryId: 'salary',
      title: 'Monthly salary',
      note: 'September salary',
      date: daysAgo(1),
      paymentMethod: 'bank',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'txn_seed_3',
      type: 'expense',
      amount: 280,
      categoryId: 'travel',
      title: 'Uber',
      note: 'Airport ride',
      date: daysAgo(2),
      paymentMethod: 'upi',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'txn_seed_4',
      type: 'expense',
      amount: 1200,
      categoryId: 'shopping',
      title: 'Clothes',
      note: 'Weekend shopping',
      date: daysAgo(3),
      paymentMethod: 'card',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'txn_seed_5',
      type: 'expense',
      amount: 299,
      categoryId: 'recharge',
      title: 'Mobile recharge',
      note: '',
      date: daysAgo(4),
      paymentMethod: 'upi',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'txn_seed_6',
      type: 'expense',
      amount: 850,
      categoryId: 'bills',
      title: 'Electricity',
      note: 'Monthly bill',
      date: daysAgo(6),
      paymentMethod: 'upi',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'txn_seed_7',
      type: 'expense',
      amount: 421,
      categoryId: 'food',
      title: 'Groceries',
      note: 'Weekly groceries',
      date: daysAgo(7),
      paymentMethod: 'cash',
      createdAt: now,
      updatedAt: now,
    },
  ];

  return seeds.map((s) => ({
    ...s,
    categoryName: getCategoryById(s.categoryId)?.name ?? 'Other',
  }));
}

export class LocalTransactionRepository implements TransactionRepository {
  private transactions: Transaction[];

  constructor(initial?: Transaction[]) {
    this.transactions = initial ? [...initial] : buildSeed();
  }

  async getTransactions(): Promise<Transaction[]> {
    return [...this.transactions].sort((a, b) => {
      if (a.date === b.date) return b.createdAt.localeCompare(a.createdAt);
      return b.date.localeCompare(a.date);
    });
  }

  async getTransactionById(id: string): Promise<Transaction | null> {
    return this.transactions.find((t) => t.id === id) ?? null;
  }

  async addTransaction(input: CreateTransactionInput): Promise<Transaction> {
    if (input.amount <= 0) {
      throw new Error('Amount must be greater than zero.');
    }
    const category = getCategoryById(input.categoryId);
    if (!category) {
      throw new Error('Please select a valid category.');
    }
    if (category.type !== input.type) {
      throw new Error('Category does not match transaction type.');
    }

    const now = new Date().toISOString();
    const transaction: Transaction = {
      id: createId(),
      type: input.type,
      amount: input.amount,
      categoryId: input.categoryId,
      categoryName: category.name,
      title: input.title.trim() || category.name,
      note: input.note?.trim() ?? '',
      date: input.date,
      paymentMethod: input.paymentMethod ?? null,
      createdAt: now,
      updatedAt: now,
    };

    this.transactions = [transaction, ...this.transactions];
    return transaction;
  }

  async updateTransaction(id: string, input: UpdateTransactionInput): Promise<Transaction> {
    const index = this.transactions.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new Error('Transaction not found.');
    }

    const existing = this.transactions[index];
    const nextType = input.type ?? existing.type;
    const nextCategoryId = input.categoryId ?? existing.categoryId;
    const category = getCategoryById(nextCategoryId);

    if (!category) {
      throw new Error('Please select a valid category.');
    }
    if (category.type !== nextType) {
      throw new Error('Category does not match transaction type.');
    }
    if (input.amount !== undefined && input.amount <= 0) {
      throw new Error('Amount must be greater than zero.');
    }

    const updated: Transaction = {
      ...existing,
      type: nextType,
      amount: input.amount ?? existing.amount,
      categoryId: nextCategoryId,
      categoryName: category.name,
      title: input.title !== undefined ? input.title.trim() || category.name : existing.title,
      note: input.note !== undefined ? input.note.trim() : existing.note,
      date: input.date ?? existing.date,
      paymentMethod:
        input.paymentMethod !== undefined ? input.paymentMethod : existing.paymentMethod,
      updatedAt: new Date().toISOString(),
    };

    this.transactions = [
      ...this.transactions.slice(0, index),
      updated,
      ...this.transactions.slice(index + 1),
    ];

    return updated;
  }

  async deleteTransaction(id: string): Promise<void> {
    const exists = this.transactions.some((t) => t.id === id);
    if (!exists) {
      throw new Error('Transaction not found.');
    }
    this.transactions = this.transactions.filter((t) => t.id !== id);
  }
}

/** Shared singleton used by MoneyProvider — swap implementation later for API. */
export const localTransactionRepository = new LocalTransactionRepository();
