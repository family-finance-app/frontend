import { Category } from './category';

export interface CreateTransactionFormData {
  type: TransactionType;
  amount: number;
  date: string;
  currency: CurrencyType;
  categoryId: string;
  accountId: string;
  description?: string;
  groupId?: string;
}

export interface CreateTransferFormData {
  accountId: number;
  accountRecipientId: number;
  groupId?: number;
  categoryId: number;
  amount: number;
  currency: CurrencyType;
  description?: string;
  date: string;
}

export enum CurrencyType {
  UAH = 'UAH',
  USD = 'USD',
  EUR = 'EUR',
}

export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
  TRANSFER = 'TRANSFER',
}

export interface Transaction {
  id: number;
  accountId: number;
  userId: number;
  groupId?: number;
  categoryId: number;
  amount: number;
  currency: CurrencyType;
  description?: string;
  date: string;
  createdAt: string;
  updatedAt: string;
  type: string;
  accountRecipientId?: number;
  user?: {
    id: number;
    name: string;
    email: string;
  };
  account?: {
    id: number;
    name: string;
    type: string;
    currency: string;
  };
  category?: {
    id: number;
    name: string;
    type: string;
    icon?: string;
    color?: string;
  };
  group?: {
    id: number;
    name: string;
  };
}

export interface TransactionResponse {
  message: string;
  transaction: Transaction;
}

export interface TransactionsListResponse {
  message: string;
  transactions: Transaction[];
}

export interface CreateTransactionResponse extends TransactionResponse {}
export interface UpdateTransactionResponse extends TransactionResponse {}

export interface DeleteTransactionResponse {
  message: string;
  id: number;
}

export interface CategoriesListResponse {
  message: string;
  categories: Category[];
}
