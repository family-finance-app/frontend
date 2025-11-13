'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-client';
import { User, UserResponse } from '@/types/profile';
import { getAuthToken } from '@/utils/token';

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: Partial<User>): Promise<UserResponse> => {
      const token = getAuthToken();
      return apiClient.put<UserResponse>('/api/user/profile', formData, {
        token: token || undefined,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.profile.all,
      });
    },
  });
};
