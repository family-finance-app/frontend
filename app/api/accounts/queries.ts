'use client';

// get data from FINANCIAL accounts

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-client';
import { Account } from '@/(main layout)/accounts/types';
import { getAuthToken } from '@/utils/token';
import { useEffect, useState } from 'react';

// get all accounts (MOCK ROUTE, DO NOT USE)
export const useAccounts = () => {
  const [token] = useState<string | null>(() =>
    typeof window !== 'undefined' ? getAuthToken() : null
  );

  return useQuery({
    queryKey: queryKeys.accounts.all,
    queryFn: async (): Promise<Account[]> => {
      return apiClient.get<Account[]>('/accounts', {
        token: token || undefined,
      });
    },
    enabled: !!token,
  });
};

// get account by id
export const useAccount = (id: number) => {
  const [token] = useState<string | null>(() =>
    typeof window !== 'undefined' ? getAuthToken() : null
  );

  return useQuery({
    queryKey: queryKeys.accounts.detail(id),
    queryFn: async (): Promise<Account> => {
      return apiClient.get<Account>(`/accounts/${id}`, {
        token: token || undefined,
      });
    },
    enabled: !!token && !!id,
  });
};

// get current user's accounts (backend extracts token from query parameters)
export const useMyAccounts = () => {
  const [token] = useState<string | null>(() =>
    typeof window !== 'undefined' ? getAuthToken() : null
  );

  return useQuery({
    queryKey: queryKeys.accounts.my,
    queryFn: async (): Promise<Account[]> => {
      return apiClient.get<Account[]>('/accounts/my', {
        token: token || undefined,
      });
    },
    enabled: !!token,
  });
};
