'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';

import {
  ChangeProfileFormData,
  UpdatedUser,
} from '@/(main layout)/settings/profile/types';

import { ApiSuccess } from '../types';
import { queryKeys } from '@/lib/query-client';
import { ApiError } from 'next/dist/server/api-utils';

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiSuccess<UpdatedUser>, ApiError, ChangeProfileFormData>({
    mutationFn: async (data) => {
      return apiClient.put<ApiSuccess<UpdatedUser>>('/user/profile', data);
    },
    onSuccess: async (response) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.profile.all });
      await queryClient.invalidateQueries({
        queryKey: queryKeys.auth.currentUser,
      });
      return response.message;
    },
    onError: (error) => {
      return error.message;
    },
  });
};
