// cache and refetch management

import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // data is considered fresh during 1 min
      gcTime: 1000 * 60 * 5, // time in cache
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      retry: 1,
    },
    mutations: {
      retry: 1,
    },
  },
});

export const queryKeys = {
  auth: {
    currentUser: ['auth', 'current-user'] as const,
  },
  accounts: {
    all: ['accounts'] as const,
    my: ['accounts', 'my'] as const,
    detail: (id: number) => ['accounts', id] as const,
    byUser: (userId: number) => ['accounts', 'user', userId] as const,
  },
  transactions: {
    all: ['transactions', 'all'] as const,
    my: ['transactions', 'my'] as const,
    detail: (id: string) => ['transactions', 'detail', id] as const,
    byAccount: (accountId: string) =>
      ['transactions', 'account', accountId] as const,
    family: ['transactions', 'family'] as const,
  },
  categories: {
    all: ['categories'] as const,
  },
  familyGroup: {
    detail: ['family-group'] as const,
    members: ['family-group', 'members'] as const,
  },
  profile: {
    all: ['profile'] as const,
  },
  exchangeRate: {
    all: ['exchangeRate'] as const,
  },
} as const;
