export interface CreateTransactionFormData {
  type: string;
  amount: string;
  date: string;
  categoryId: string;
  accountId?: string;
  groupId?: string;
}

export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
  TRANSFER = 'TRANSFER',
}

export interface Transaction {
  id: number;
  userId: number;
  groupId?: number;
  accountId: number;
  type: string;
  categoryId: number;
  amount: number;
  date: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
  account?: {
    id: number;
    title: string;
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

export interface Category {
  id: number;
  name: string;
  type: string;
  description?: string;
  icon?: string;
  color?: string;
  isActive: boolean;
}
