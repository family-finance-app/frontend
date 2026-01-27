'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';

import { getAuthToken } from '@/utils';

import {
  ChangeEmailFormData,
  ChangePasswordFormData,
  UpdatedEmail,
  UpdatedPassword,
} from '@/(main layout)/settings/security/types';
import { ApiError, ApiSuccess } from '../types';
import { User } from '@/(main layout)/settings/profile/types';
import { queryClient, queryKeys } from '@/lib/query-client';

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
    onSuccess: (resposne) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profile.all });
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
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profile.all });
      return response.message;
    },
    onError: (error) => {
      return error.message;
    },
  });
};
