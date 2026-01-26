export interface CreateTransactionFormData {
  type: TransactionType;
  amount: number;
  date: string;
  currency: CurrencyType;
  categoryId: number;
  accountId: number;
  description?: string;
  groupId?: number;
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

export interface UpdateTransactionFormData {
  amount: number;
  date: string;
  categoryId?: number;
  description?: string;
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

export interface NewTransaction {
  id: number;
  accountId: number;
  userId: number;
  categoryId: number;
  amount: number;
  currency: CurrencyType;
  description: string;
  date: string;
  type: TransactionType;
  createdAt?: string;
  updatedAt?: string;
}

export interface Transaction {
  id: number; //
  accountId: number; //
  accountBalance?: number;
  userId: number; //
  groupId?: number; //
  categoryId: number; //
  categoryName?: string;
  amount: number; //
  currency: CurrencyType; //
  description: string; //
  date: string; //
  type: TransactionType; //
  accountRecipientId?: number; //
  createdAt?: string; //
  updatedAt?: string;
}

export interface UpdatedTransaction extends NewTransaction {}
export interface DeletedTransaction {
  id: number;
}

export interface NewTransfer extends Transaction {}
export interface Category {
  id: number;
  name: string;
  type: string;
  icon: string;
  color: string;
}
