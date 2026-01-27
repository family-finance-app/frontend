// cache and refetch management

import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      gcTime: 0,
      refetchOnWindowFocus: process.env.NODE_ENV === 'production',
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
    all: ['transactions'] as const,
    my: ['transactions', 'my'] as const,
    detail: (id: string) => ['transactions', id] as const,
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
} as const;
