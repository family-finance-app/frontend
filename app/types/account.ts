export interface CreateAccountFormData {
  title: string;
  type: string;
  balance: string;
  currency: string;
}

export interface Account {
  id: number;
  title: string;
  type: string;
  balance: number;
  currency: string;
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
