'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';

import {
  ChangeProfileFormData,
  UpdatedUser,
  User,
} from '@/(main layout)/settings/profile/types';

import { getAuthToken } from '@/utils';
import { ApiSuccess } from '../types';
import { ApiError } from 'next/dist/server/api-utils';

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiSuccess<UpdatedUser>, ApiError, ChangeProfileFormData>({
    mutationFn: async (data) => {
      return apiClient.put<ApiSuccess<UpdatedUser>>('/user/profile', data);
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
