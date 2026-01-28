'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';

import {
  CreateAccountFormData,
  DeletedAccount,
  EditAccountFormData,
  NewAccount,
  UpdatedAccount,
} from '@/(main layout)/accounts/types';
import { ApiSuccess, ApiError } from '../types';
import { queryKeys } from '@/lib/query-client';

// create, update, or delete FINANCIAL accounts

export const useCreateAccount = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiSuccess<NewAccount>, ApiError, CreateAccountFormData>({
    mutationFn: async (data) => {
      return apiClient.post<ApiSuccess<NewAccount>>('/accounts/create', data);
    },
    onSuccess: async (response) => {
      await queryClient.refetchQueries({
        queryKey: queryKeys.accounts.all,
        type: 'active',
      });
      return response.message;
    },

    onError: (error) => {
      return error.message;
    },
  });
};

export const useUpdateAccount = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiSuccess<UpdatedAccount>,
    ApiError,
    { id: number; data: Partial<EditAccountFormData> }
  >({
    mutationFn: async ({ id, data }) => {
      return apiClient.put<ApiSuccess<UpdatedAccount>>(`/accounts/${id}`, data);
    },
    onSuccess: async (response) => {
      await queryClient.refetchQueries({
        queryKey: queryKeys.accounts.all,
        type: 'active',
      });
      await queryClient.refetchQueries({
        queryKey: queryKeys.transactions.all,
        type: 'active',
      });
      return response.message;
    },
    onError: (error) => {
      return error.message;
    },
  });
};

export const useDeleteAccount = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiSuccess<DeletedAccount>, ApiError, { id: number }>({
    mutationFn: async ({ id }) => {
      return apiClient.delete<ApiSuccess<DeletedAccount>>(`/accounts/${id}`);
    },
    onSuccess: async (response) => {
      await queryClient.refetchQueries({
        queryKey: queryKeys.accounts.all,
        type: 'active',
      });
      await queryClient.refetchQueries({
        queryKey: queryKeys.transactions.all,
        type: 'active',
      });
      return response.message;
    },
    onError: (error) => {
      return error.message;
    },
  });
};
