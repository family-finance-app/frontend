'use client';

// get data from FINANCIAL accounts

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-client';
import { Account } from '@/types/account';
import { getAuthToken } from '@/utils/token';
import { useEffect, useState } from 'react';

// get all accounts (MOCK ROUTE, DO NOT USE)
export const useAccounts = () => {
  const [token, setToken] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setToken(getAuthToken());
  }, []);

  return useQuery({
    queryKey: queryKeys.accounts.all,
    queryFn: async (): Promise<Account[]> => {
      return apiClient.get<Account[]>('/api/accounts', {
        token: token || undefined,
      });
    },
    enabled: !!token && isClient,
  });
};

// get account by id
export const useAccount = (id: number) => {
  const [token, setToken] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setToken(getAuthToken());
  }, []);

  return useQuery({
    queryKey: queryKeys.accounts.detail(id),
    queryFn: async (): Promise<Account> => {
      return apiClient.get<Account>(`/api/accounts/${id}`, {
        token: token || undefined,
      });
    },
    enabled: !!token && !!id && isClient,
  });
};

// get current user's accounts (backend extracts token from query parameters)
export const useMyAccounts = () => {
  const [token, setToken] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setToken(getAuthToken());
  }, []);

  return useQuery({
    queryKey: queryKeys.accounts.my,
    queryFn: async (): Promise<Account[]> => {
      return apiClient.get<Account[]>('/api/accounts/my', {
        token: token || undefined,
      });
    },
    enabled: !!token && isClient,
  });
};
