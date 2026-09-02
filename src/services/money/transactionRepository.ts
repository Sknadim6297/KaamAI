import type {
  CreateTransactionInput,
  Transaction,
  UpdateTransactionInput,
} from '../../types/money';

/**
 * Abstraction for transaction persistence.
 * Screens depend on this interface — swap LocalTransactionRepository
 * for ApiTransactionRepository later without rewriting UI.
 */
export interface TransactionRepository {
  getTransactions(): Promise<Transaction[]>;
  getTransactionById(id: string): Promise<Transaction | null>;
  addTransaction(input: CreateTransactionInput): Promise<Transaction>;
  updateTransaction(id: string, input: UpdateTransactionInput): Promise<Transaction>;
  deleteTransaction(id: string): Promise<void>;
}
