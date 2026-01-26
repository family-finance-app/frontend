'use client';

import { useState } from 'react';

import { useQuery } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-client';

import { Account } from '@/(main layout)/accounts/types';

import { getAuthToken } from '@/utils';
import { ApiError, ApiSuccess } from '../types';
import { error } from 'console';

// get all user accounts info
export const useMyAccounts = () => {
  const token = getAuthToken();

  const query = useQuery<ApiSuccess<Account[]>, ApiError>({
    queryKey: queryKeys.accounts.all,

    queryFn: async () => {
      const response =
        await apiClient.get<ApiSuccess<Account[]>>('/accounts/my');
      return response;
    },
    enabled: !!token,
  });

  return { accounts: query.data?.data || [], ...query };
};
