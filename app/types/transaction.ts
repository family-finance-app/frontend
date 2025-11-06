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

export interface Category {
  id: number;
  name: string;
  type: string;
  icon?: string;
  color?: string;
  isActive?: boolean;
  createdAt?: string;
  description?: string;
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
  description?: string;
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
