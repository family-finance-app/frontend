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
    all: ['auth'] as const,
    user: ['currentUser'] as const,
  },
  accounts: {
    all: ['accounts'] as const,
  },
  transactions: {
    all: ['transactions'] as const,
  },
  categories: {
    all: ['categories'] as const,
  },
  exchangeRate: {
    all: ['exchangeRates'] as const,
  },
  familyGroup: {
    all: ['family-group'] as const,
  },
  profile: {
    all: ['profile'] as const,
  },
} as const;
