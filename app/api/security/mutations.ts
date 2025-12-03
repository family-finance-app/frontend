'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-client';
import { getAuthToken } from '@/utils/token';
import {
  EmailChangeFormData,
  PasswordChangeFormData,
  SecurityUpdateResponse,
} from '@/types/security';

export const useUpdateUserPassword = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      formData: PasswordChangeFormData
    ): Promise<SecurityUpdateResponse> => {
      const token = getAuthToken();
      return apiClient.put<SecurityUpdateResponse>('/user/password', formData, {
        token: token || undefined,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profile.all });
    },
  });
};

export const useUpdateUserEmail = () => {
  const queryCLient = useQueryClient();

  return useMutation({
    mutationFn: async (
      formData: EmailChangeFormData
    ): Promise<SecurityUpdateResponse> => {
      const token = getAuthToken();
      return apiClient.put<SecurityUpdateResponse>('/user/email', formData, {
        token: token || undefined,
      });
    },
    onSuccess() {
      queryCLient.invalidateQueries({ queryKey: queryKeys.profile.all });
    },
  });
};
