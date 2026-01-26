'use client';

import { useMutation } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';

import {
  Account,
  CreateAccountFormData,
  DeletedAccount,
  EditAccountFormData,
  NewAccount,
  UpdatedAccount,
} from '@/(main layout)/accounts/types';
import { ApiSuccess, ApiError } from '../types';

import { getAuthToken } from '@/utils';
import { queryClient } from '@/lib/query-client';

// create, update, or delete FINANCIAL accounts

export const useCreateAccount = () => {
  return useMutation<ApiSuccess<NewAccount>, ApiError, CreateAccountFormData>({
    mutationFn: async (data) => {
      const token = getAuthToken();
      return apiClient.post<ApiSuccess<NewAccount>>('/accounts/create', data);
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      return response.message;
    },

    onError: (error) => {
      return error.message;
    },
  });
};

export const useUpdateAccount = () => {
  return useMutation<
    ApiSuccess<UpdatedAccount>,
    ApiError,
    { id: number; data: Partial<EditAccountFormData> }
  >({
    mutationFn: async ({ id, data }) => {
      const token = getAuthToken();
      return apiClient.put<ApiSuccess<UpdatedAccount>>(`/accounts/${id}`, data);
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      return response.message;
    },
    onError: (error) => {
      return error.message;
    },
  });
};

export const useDeleteAccount = () => {
  return useMutation<ApiSuccess<DeletedAccount>, ApiError, { id: number }>({
    mutationFn: async ({ id }) => {
      const token = getAuthToken();
      return apiClient.delete<ApiSuccess<DeletedAccount>>(`/accounts/${id}`);
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      return response.message;
    },
    onError: (error) => {
      return error.message;
    },
  });
};
