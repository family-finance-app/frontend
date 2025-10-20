/**
 * TanStack Query configuration
 * Central configuration for all API queries and mutations
 */

import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Time before data is considered stale (5 minutes)
      staleTime: 1000 * 60 * 5,
      // Time before inactive queries are garbage collected (10 minutes)
      gcTime: 1000 * 60 * 10,
      // Retry failed requests once
      retry: 1,
      // Don't refetch on window focus in development
      refetchOnWindowFocus: process.env.NODE_ENV === 'production',
    },
    mutations: {
      // Retry failed mutations once
      retry: 1,
    },
  },
});

/**
 * Query keys for cache management
 * Using constants ensures consistency across the app
 */
export const queryKeys = {
  auth: {
    currentUser: ['auth', 'current-user'] as const,
  },
  accounts: {
    all: ['accounts'] as const,
    detail: (id: number) => ['accounts', id] as const,
    byUser: (userId: number) => ['accounts', 'user', userId] as const,
  },
  transactions: {
    all: ['transactions'] as const,
    detail: (id: number) => ['transactions', id] as const,
    byAccount: (accountId: number) =>
      ['transactions', 'account', accountId] as const,
    byUser: (userId: number) => ['transactions', 'user', userId] as const,
    family: ['transactions', 'family'] as const,
  },
  categories: {
    all: ['categories'] as const,
  },
  familyGroup: {
    detail: ['family-group'] as const,
    members: ['family-group', 'members'] as const,
  },
  reports: {
    all: ['reports'] as const,
    byPeriod: (startDate: string, endDate: string) =>
      ['reports', startDate, endDate] as const,
  },
} as const;
