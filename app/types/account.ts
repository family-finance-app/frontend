export interface CreateAccountFormData {
  name: string;
  type: 'DEBIT' | 'CREDIT' | 'CASH' | 'BANK' | 'INVESTMENT' | 'DEPOSIT';
  balance: number;
  currency: 'UAH' | 'USD' | 'EUR';
}

export interface Account {
  id: number;
  name: string;
  type: 'DEBIT' | 'CREDIT' | 'CASH' | 'BANK' | 'INVESTMENT' | 'DEPOSIT';
  balance: number;
  currency: 'UAH' | 'USD' | 'EUR';
  groupId?: number;
  userId: number;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
}

export interface AccountResponse {
  message: string;
  account: Account;
}
