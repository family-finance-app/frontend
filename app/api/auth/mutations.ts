'use client';

import { useMutation } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';

import { SignUpFormData, SignInFormData, NewUser, Login } from '@/(auth)/types';
import { User } from '@/(main layout)/settings/profile/types';

import { clearAuthToken, getAuthToken, setAuthToken } from '@/utils';
import { ApiError, ApiSuccess } from '../types';
import { queryClient, queryKeys } from '@/lib/query-client';

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
        console.log('🔐 Login response:', response);
        setAuthToken(response.data.accessToken);
        if (!response.data.accessToken) {
          console.error('❌ No token in login response!', response);
          return;
        }
        console.log(
          '🔐 Setting token from login:',
          response.data.accessToken.substring(0, 20) + '...',
        );

        const savedToken = getAuthToken();
        console.log('🔐 Verified saved token:', savedToken ? 'OK' : 'FAILED');
      }

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
      queryClient.clear();
      return response.message;
    },
    onError: (error) => {
      return error.message;
    },
  });
};
