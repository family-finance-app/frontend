import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-client';
import { Account, AccountResponse } from '@/types/account';

// get all accounts
export const useAccounts = () => {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

  return useQuery({
    queryKey: queryKeys.accounts.all,
    queryFn: async (): Promise<AccountResponse[]> => {
      return apiClient.get<AccountResponse[]>('/api/accounts', {
        token: token || undefined,
      });
    },
    enabled: !!token,
  });
};

// get an account by id
export const useAccount = (id: number) => {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

  return useQuery({
    queryKey: queryKeys.accounts.detail(id),
    queryFn: async (): Promise<AccountResponse> => {
      return apiClient.get<AccountResponse>(`/api/accounts/${id}`, {
        token: token || undefined,
      });
    },
    enabled: !!token && !!id,
  });
};

// get current user's accounts (using /api/accounts/my endpoint)
export const useMyAccounts = () => {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

  return useQuery({
    queryKey: queryKeys.accounts.my,
    queryFn: async (): Promise<Account[]> => {
      const response = await apiClient.get<Account[] | AccountResponse[]>(
        '/api/accounts/my',
        {
          token: token || undefined,
        }
      );
      if (Array.isArray(response) && response.length > 0) {
        const firstItem = response[0];
        if (
          firstItem &&
          typeof firstItem === 'object' &&
          'account' in firstItem
        ) {
          return (response as AccountResponse[]).map((item) => item.account);
        }
      }

      return response as Account[];
    },
    enabled: !!token,
  });
};
