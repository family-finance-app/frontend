import {
  CreateTransactionFormData,
  TransactionResponse,
  Category,
} from '@/types/transaction';

import { ApiError } from '@/types/auth';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

class TransactionAPI {
  private async request<T>(endpoint: string, options: RequestInit): Promise<T> {
    const url = `${BACKEND_URL}${endpoint}`;

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options, // CHECK
    });

    const data = await response.json();

    if (!response.ok) {
      throw {
        status: response.status,
        ...data,
      } as ApiError & { status: number };
    }

    return data as T;
  }

  // createTransaction class method
  async createTransaction(
    formData: CreateTransactionFormData
  ): Promise<TransactionResponse> {
    return this.request<TransactionResponse>('/api/transactions', {
      method: 'POST',
      body: JSON.stringify({
        type: formData.type,
        amount: parseFloat(formData.amount),
        date: formData.date,
        userId: 1, // TODO: get from auth context
        groupId: formData.groupId ? parseInt(formData.groupId) : null,
        accountId: formData.accountId ? parseInt(formData.accountId) : 1,
        categoryId: parseInt(formData.categoryId),
      }),
    });
  }

  // getCategories class method
  async getCategories(type?: string): Promise<{ categories: Category[] }> {
    const url = type ? `/api/categories?type=${type}` : '/api/categories';
    return this.request<{ categories: Category[] }>(url, {
      method: 'GET',
    });
  }

  // getAccounts class method
  async getAccounts(): Promise<{
    accounts: Array<{
      id: number;
      title: string;
      type: string;
      currency: string;
    }>;
  }> {
    return this.request<{
      accounts: Array<{
        id: number;
        title: string;
        type: string;
        currency: string;
      }>;
    }>('/api/accounts', {
      method: 'GET',
    });
  }
}

export const transactionAPI = new TransactionAPI();
