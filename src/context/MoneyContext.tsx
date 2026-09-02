import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  localTransactionRepository,
  type TransactionRepository,
} from '../services/money';
import type {
  CreateTransactionInput,
  MoneySummary,
  Transaction,
  TransactionFilters,
  UpdateTransactionInput,
} from '../types/money';
import { computeSummary, filterTransactions } from '../utils/money';

interface MoneyContextValue {
  transactions: Transaction[];
  filteredTransactions: Transaction[];
  filters: TransactionFilters;
  summary: MoneySummary;
  loading: boolean;
  error: string | null;
  sheetOpen: boolean;
  sheetMode: 'add' | 'edit';
  editingTransaction: Transaction | null;
  preferredAddType: 'income' | 'expense';
  setFilters: (patch: Partial<TransactionFilters>) => void;
  setMonth: (month: number, year: number) => void;
  shiftMonth: (delta: number) => void;
  openAddSheet: (type?: 'income' | 'expense') => void;
  openEditSheet: (transaction: Transaction) => void;
  closeSheet: () => void;
  addTransaction: (input: CreateTransactionInput) => Promise<void>;
  updateTransaction: (id: string, input: UpdateTransactionInput) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
}

const MoneyContext = createContext<MoneyContextValue | null>(null);

function createDefaultFilters(): TransactionFilters {
  const now = new Date();
  return {
    type: 'all',
    dateRange: 'this_month',
    categoryId: 'all',
    search: '',
    month: now.getMonth(),
    year: now.getFullYear(),
  };
}

interface MoneyProviderProps {
  children: React.ReactNode;
  repository?: TransactionRepository;
}

export function MoneyProvider({
  children,
  repository = localTransactionRepository,
}: MoneyProviderProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filters, setFiltersState] = useState<TransactionFilters>(createDefaultFilters);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetMode, setSheetMode] = useState<'add' | 'edit'>('add');
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [preferredAddType, setPreferredAddType] = useState<'income' | 'expense'>('expense');

  const refresh = useCallback(async () => {
    try {
      setError(null);
      const data = await repository.getTransactions();
      setTransactions(data);
    } catch {
      setError('Could not load transactions. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [repository]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const setFilters = useCallback((patch: Partial<TransactionFilters>) => {
    setFiltersState((prev) => {
      const next = { ...prev, ...patch };

      if (patch.dateRange === 'this_month') {
        const now = new Date();
        next.month = now.getMonth();
        next.year = now.getFullYear();
      } else if (patch.dateRange === 'last_month') {
        const now = new Date();
        const last = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        next.month = last.getMonth();
        next.year = last.getFullYear();
      }

      return next;
    });
  }, []);

  const setMonth = useCallback((month: number, year: number) => {
    setFiltersState((prev) => ({
      ...prev,
      month,
      year,
      dateRange: 'custom',
    }));
  }, []);

  const shiftMonth = useCallback((delta: number) => {
    setFiltersState((prev) => {
      const date = new Date(prev.year, prev.month + delta, 1);
      return {
        ...prev,
        month: date.getMonth(),
        year: date.getFullYear(),
        dateRange: 'custom',
      };
    });
  }, []);

  const openAddSheet = useCallback((type: 'income' | 'expense' = 'expense') => {
    setPreferredAddType(type);
    setSheetMode('add');
    setEditingTransaction(null);
    setSheetOpen(true);
  }, []);

  const openEditSheet = useCallback((transaction: Transaction) => {
    setSheetMode('edit');
    setEditingTransaction(transaction);
    setSheetOpen(true);
  }, []);

  const closeSheet = useCallback(() => {
    setSheetOpen(false);
    setEditingTransaction(null);
  }, []);

  const addTransaction = useCallback(
    async (input: CreateTransactionInput) => {
      try {
        await repository.addTransaction(input);
        await refresh();
        setSheetOpen(false);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Could not add transaction. Please try again.';
        throw new Error(message);
      }
    },
    [repository, refresh],
  );

  const updateTransaction = useCallback(
    async (id: string, input: UpdateTransactionInput) => {
      try {
        await repository.updateTransaction(id, input);
        await refresh();
        setSheetOpen(false);
        setEditingTransaction(null);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Could not update transaction. Please try again.';
        throw new Error(message);
      }
    },
    [repository, refresh],
  );

  const deleteTransaction = useCallback(
    async (id: string) => {
      try {
        await repository.deleteTransaction(id);
        await refresh();
        setSheetOpen(false);
        setEditingTransaction(null);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Could not delete transaction. Please try again.';
        throw new Error(message);
      }
    },
    [repository, refresh],
  );

  const filteredTransactions = useMemo(
    () => filterTransactions(transactions, filters),
    [transactions, filters],
  );

  const summary = useMemo(
    () => computeSummary(transactions, filters.month, filters.year),
    [transactions, filters.month, filters.year],
  );

  const value = useMemo<MoneyContextValue>(
    () => ({
      transactions,
      filteredTransactions,
      filters,
      summary,
      loading,
      error,
      sheetOpen,
      sheetMode,
      editingTransaction,
      preferredAddType,
      setFilters,
      setMonth,
      shiftMonth,
      openAddSheet,
      openEditSheet,
      closeSheet,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      refresh,
    }),
    [
      transactions,
      filteredTransactions,
      filters,
      summary,
      loading,
      error,
      sheetOpen,
      sheetMode,
      editingTransaction,
      preferredAddType,
      setFilters,
      setMonth,
      shiftMonth,
      openAddSheet,
      openEditSheet,
      closeSheet,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      refresh,
    ],
  );

  return <MoneyContext.Provider value={value}>{children}</MoneyContext.Provider>;
}

export function useMoney(): MoneyContextValue {
  const ctx = useContext(MoneyContext);
  if (!ctx) {
    throw new Error('useMoney must be used within MoneyProvider');
  }
  return ctx;
}
