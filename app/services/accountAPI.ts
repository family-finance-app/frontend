import { CreateAccountFormData, AccountResponse } from '@/types/account';

import { ApiError } from '@/types/auth';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

class AccountAPI {
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

  // createAccount class method
  async createAccount(
    formData: CreateAccountFormData
  ): Promise<AccountResponse> {
    return this.request<AccountResponse>('/api/accounts', {
      method: 'POST',
      body: JSON.stringify({
        title: formData.title,
        type: formData.type,
        balance: formData.balance,
        currency: formData.currency,
        createdBy: 1, // TODO: get from auth context
        userId: 1, // TODO: get from auth context
      }),
    });
  }
}

export const accountAPI = new AccountAPI();
