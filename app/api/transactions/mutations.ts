'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';

import {
  CreateTransactionFormData,
  CreateTransferFormData,
  DeletedTransaction,
  NewTransaction,
  NewTransfer,
  Transaction,
  UpdatedTransaction,
  UpdateTransactionFormData,
} from '@/(main layout)/transactions/types';

import { getAuthToken } from '@/utils';
import { ApiError, ApiSuccess } from '../types';
import { queryClient, queryKeys } from '@/lib/query-client';

const token = getAuthToken();

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiSuccess<NewTransaction>,
    ApiError,
    CreateTransactionFormData
  >({
    mutationFn: async (data) => {
      return apiClient.post<ApiSuccess<NewTransaction>>(
        '/transactions/create',
        data,
      );
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.my });
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts.my });
      return response.message;
    },
    onError: (error) => {
      return error.message;
    },
  });
};

export const useUpdateTransaction = () => {
  return useMutation<
    ApiSuccess<UpdatedTransaction>,
    ApiError,
    { id: number; data: UpdateTransactionFormData }
  >({
    mutationFn: async (id, data) => {
      return apiClient.put<ApiSuccess<UpdatedTransaction>>(
        `/transactions/update`,
        {
          id,
          ...data,
        },
      );
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      return response.message;
    },
    onError: (error) => {
      return error.message;
    },
  });
};

export const useDeleteTransaction = () => {
  return useMutation<ApiSuccess<DeletedTransaction>, ApiError, number>({
    mutationFn: async (id: number) => {
      return apiClient.delete<ApiSuccess<DeletedTransaction>>(
        `/transactions/delete/${id}`,
      );
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      return response.message;
    },
    onError: (error) => {
      return error.message;
    },
  });
};

export const useCreateTransfer = () => {
  return useMutation<ApiSuccess<NewTransfer>, ApiError, CreateTransferFormData>(
    {
      mutationFn: async (data) => {
        return apiClient.post<ApiSuccess<NewTransfer>>(
          '/transactions/transfer',
          data,
        );
      },
      onSuccess: (response) => {
        queryClient.invalidateQueries({ queryKey: ['transactions'] });
        return response.message;
      },
      onError: (error) => {
        return error.message;
      },
    },
  );
};
