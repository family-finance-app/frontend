'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import {
  CreateTransactionFormData,
  CreateTransferFormData,
  Transaction,
  DeletedTransaction,
  NewTransaction,
  NewTransfer,
  UpdatedTransaction,
  UpdateTransactionFormData,
} from '@/(main layout)/transactions/types';

import { ApiError, ApiSuccess } from '../types';
import { invalidateActiveQueries, queryKeys } from '@/lib/query-client';

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
    onSuccess: async (response) => {
      queryClient.setQueryData(
        queryKeys.transactions.all,
        (oldData: ApiSuccess<Transaction[]> | undefined) => {
          const prev = oldData?.data ?? [];
          return {
            ...(oldData ?? {
              statusCode: 200,
              message: response.message,
              data: [],
            }),
            data: [response.data, ...prev],
          } as ApiSuccess<Transaction[]>;
        },
      );
      await invalidateActiveQueries(queryClient, queryKeys.transactions.all);
      await invalidateActiveQueries(queryClient, queryKeys.accounts.all);

      return response.message;
    },
    onError: (error) => {
      return error.message;
    },
  });
};

export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiSuccess<UpdatedTransaction>,
    ApiError,
    { id: number; data: UpdateTransactionFormData }
  >({
    mutationFn: async ({ id, data }) => {
      return apiClient.put<ApiSuccess<UpdatedTransaction>>(
        `/transactions/update`,
        {
          id,
          ...data,
        },
      );
    },
    onSuccess: async (response) => {
      queryClient.setQueryData(
        queryKeys.transactions.all,
        (oldData: ApiSuccess<Transaction[]> | undefined) => {
          const prev = oldData?.data ?? [];
          return {
            ...(oldData ?? {
              statusCode: 200,
              message: response.message,
              data: [],
            }),
            data: prev.map((item) =>
              item.id === response.data.id ? response.data : item,
            ),
          } as ApiSuccess<Transaction[]>;
        },
      );
      await invalidateActiveQueries(queryClient, queryKeys.transactions.all);
      await invalidateActiveQueries(queryClient, queryKeys.accounts.all);

      return response.message;
    },
    onError: (error) => {
      return error.message;
    },
  });
};

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiSuccess<DeletedTransaction>, ApiError, number>({
    mutationFn: async (id: number) => {
      return apiClient.delete<ApiSuccess<DeletedTransaction>>(
        `/transactions/delete/${id}`,
      );
    },
    onSuccess: async (response) => {
      queryClient.setQueryData(
        queryKeys.transactions.all,
        (oldData: ApiSuccess<Transaction[]> | undefined) => {
          const prev = oldData?.data ?? [];
          return {
            ...(oldData ?? {
              statusCode: 200,
              message: response.message,
              data: [],
            }),
            data: prev.filter((item) => item.id !== response.data.id),
          } as ApiSuccess<Transaction[]>;
        },
      );
      await invalidateActiveQueries(queryClient, queryKeys.transactions.all);
      await invalidateActiveQueries(queryClient, queryKeys.accounts.all);

      return response.message;
    },
    onError: (error) => {
      return error.message;
    },
  });
};

export const useCreateTransfer = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiSuccess<NewTransfer>, ApiError, CreateTransferFormData>(
    {
      mutationFn: async (data) => {
        return apiClient.post<ApiSuccess<NewTransfer>>(
          '/transactions/transfer',
          data,
        );
      },
      onSuccess: async (response) => {
        queryClient.setQueryData(
          queryKeys.transactions.all,
          (oldData: ApiSuccess<Transaction[]> | undefined) => {
            const prev = oldData?.data ?? [];
            return {
              ...(oldData ?? {
                statusCode: 200,
                message: response.message,
                data: [],
              }),
              data: [response.data, ...prev],
            } as ApiSuccess<Transaction[]>;
          },
        );
        await invalidateActiveQueries(queryClient, queryKeys.transactions.all);
        await invalidateActiveQueries(queryClient, queryKeys.accounts.all);

        return response.message;
      },
      onError: (error) => {
        return error.message;
      },
    },
  );
};
