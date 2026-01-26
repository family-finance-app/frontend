'use client';

import { useMutation } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';

import { SignUpFormData, SignInFormData, NewUser, Login } from '@/(auth)/types';
import { User } from '@/(main layout)/settings/profile/types';

import { clearAuthToken, setAuthToken } from '@/utils';
import { ApiError, ApiSuccess } from '../types';
import { queryClient } from '@/lib/query-client';

export const useSignUp = () => {
  return useMutation<ApiSuccess<NewUser>, ApiError, Partial<SignUpFormData>>({
    mutationFn: async (data: Partial<SignUpFormData>) => {
      return apiClient.post<ApiSuccess<NewUser>>('/auth/signup', {
        data,
      });
    },
    onSuccess: (response) => {
      if (response.data && response.data.accessToken) {
        setAuthToken(response.data.accessToken);
      }
      queryClient.invalidateQueries({ queryKey: ['auth'] });
      return response.message;
    },
    onError: (error) => {
      return error.message;
    },
  });
};

export const useSignIn = () => {
  return useMutation<ApiSuccess<Login>, ApiError, SignInFormData>({
    mutationFn: async (data: SignInFormData) => {
      return await apiClient.post<ApiSuccess<Login>>('/auth/login', data);
    },
    onSuccess: (response) => {
      if (response.data && response.data.accessToken) {
        setAuthToken(response.data.accessToken);
      }
      queryClient.invalidateQueries({ queryKey: ['auth'] });
      return response.message;
    },
    onError: (error) => {
      return error.message;
    },
  });
};

// logout
export const useSignOut = () => {
  return useMutation<ApiSuccess<null>, ApiError>({
    mutationFn: async () => {
      return apiClient.post<ApiSuccess<null>>('/auth/logout');
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['auth'] });
      clearAuthToken();
      return response.message;
    },
    onError: (error) => {
      return error.message;
    },
  });
};
