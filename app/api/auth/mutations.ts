'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';

import { SignUpFormData, SignInFormData, NewUser, Login } from '@/(auth)/types';

import { clearAuthToken, getAuthToken, setAuthToken } from '@/utils';
import { ApiError, ApiSuccess } from '../types';
import { queryClient } from '@/lib/query-client';
import { useAuth } from '@/components/guards/AuthContext';

export const useSignUp = () => {
  const queryClient = useQueryClient();

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
  const queryClient = useQueryClient();

  return useMutation<ApiSuccess<Login>, ApiError, SignInFormData>({
    mutationFn: async (data: SignInFormData) => {
      return await apiClient.post<ApiSuccess<Login>>('/auth/login', data);
    },
    onSuccess: (response) => {
      if (response.data && response.data.accessToken) {
        setAuthToken(response.data.accessToken);

        if (!response.data.accessToken) {
          console.error(' No token in login response!', response);
          return;
        }
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
  const { clearToken } = useAuth();
  return useMutation<ApiSuccess<null>, ApiError>({
    mutationFn: async () => {
      return apiClient.post<ApiSuccess<null>>('/auth/logout');
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['auth'] });
      clearToken();
      queryClient.clear();
      return response.message;
    },
    onError: (error) => {
      return error.message;
    },
  });
};
