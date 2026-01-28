'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';

import {
  ChangeProfileFormData,
  UpdatedUser,
} from '@/(main layout)/settings/profile/types';

import { ApiSuccess } from '../types';
import { invalidateActiveQueries, queryKeys } from '@/lib/query-client';
import { ApiError } from 'next/dist/server/api-utils';

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiSuccess<UpdatedUser>, ApiError, ChangeProfileFormData>({
    mutationFn: async (data) => {
      return apiClient.put<ApiSuccess<UpdatedUser>>('/user/profile', data);
    },
    onSuccess: (resposne) => {
      invalidateActiveQueries(queryClient, queryKeys.profile.all);
      return resposne.message;
    },
    onError: (error) => {
      return error.message;
    },
  });
};
