'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import {
  ChangeEmailFormData,
  ChangePasswordFormData,
  UpdatedEmail,
  UpdatedPassword,
} from '@/(main layout)/settings/security/types';
import { ApiError, ApiSuccess } from '../types';
import { queryKeys } from '@/lib/query-client';

export const useUpdateUserPassword = () => {
  const queryCLient = useQueryClient();

  return useMutation<
    ApiSuccess<UpdatedPassword>,
    ApiError,
    ChangePasswordFormData
  >({
    mutationFn: async (data) => {
      return apiClient.put<ApiSuccess<UpdatedPassword>>('/user/password', data);
    },
    onSuccess: async (resposne) => {
      await queryCLient.invalidateQueries({ queryKey: queryKeys.profile.all });
      await queryCLient.invalidateQueries({
        queryKey: queryKeys.auth.currentUser,
      });
      return resposne.message;
    },
    onError: (error) => {
      return error.message;
    },
  });
};

export const useUpdateUserEmail = () => {
  const queryCLient = useQueryClient();

  return useMutation<ApiSuccess<UpdatedEmail>, ApiError, ChangeEmailFormData>({
    mutationFn: async (data) => {
      return apiClient.put<ApiSuccess<UpdatedEmail>>('/user/email', data);
    },
    onSuccess: async (response) => {
      await queryCLient.invalidateQueries({ queryKey: queryKeys.profile.all });
      await queryCLient.invalidateQueries({
        queryKey: queryKeys.auth.currentUser,
      });
      return response.message;
    },
    onError: (error) => {
      return error.message;
    },
  });
};
