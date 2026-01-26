'use client';

import { useMutation } from '@tanstack/react-query';

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
import { queryClient } from '@/lib/query-client';

export const useUpdateUserPassword = () => {
  return useMutation<
    ApiSuccess<UpdatedPassword>,
    ApiError,
    ChangePasswordFormData
  >({
    mutationFn: async (data) => {
      return apiClient.put<ApiSuccess<UpdatedPassword>>('/user/password', data);
    },
    onSuccess: (resposne) => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      return resposne.message;
    },
    onError: (error) => {
      return error.message;
    },
  });
};

export const useUpdateUserEmail = () => {
  return useMutation<ApiSuccess<UpdatedEmail>, ApiError, ChangeEmailFormData>({
    mutationFn: async (data) => {
      return apiClient.put<ApiSuccess<UpdatedEmail>>('/user/email', data);
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      return response.message;
    },
    onError: (error) => {
      return error.message;
    },
  });
};
