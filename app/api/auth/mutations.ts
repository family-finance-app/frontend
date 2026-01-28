'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';

import { SignUpFormData, SignInFormData, NewUser, Login } from '@/(auth)/types';

import { ApiError, ApiSuccess } from '../types';
import { queryKeys } from '@/lib/query-client';
import { useAuth } from '@/components/guards/AuthContext';

export const useSignUp = () => {
  const { setToken } = useAuth();

  return useMutation<ApiSuccess<NewUser>, ApiError, SignUpFormData>({
    mutationFn: async (data: SignUpFormData) => {
      return apiClient.post<ApiSuccess<NewUser>>('/auth/signup', {
        data,
      });
    },
    onSuccess: async (response) => {
      if (response.data?.accessToken) {
        setToken(response.data.accessToken);
        await Promise.resolve();
      }
      return response.message;
    },
    onError: (error) => {
      return error.message;
    },
  });
};

export const useSignIn = () => {
  const { setToken } = useAuth();

  return useMutation<ApiSuccess<Login>, ApiError, SignInFormData>({
    mutationFn: async (data: SignInFormData) => {
      return await apiClient.post<ApiSuccess<Login>>('/auth/login', data);
    },
    onSuccess: async (response) => {
      if (response.data?.accessToken) {
        setToken(response.data.accessToken);
        await Promise.resolve();
      } else {
        console.error('No token in login response!', response);
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
  const { clearToken } = useAuth();
  const queryClient = useQueryClient();
  return useMutation<ApiSuccess<null>, ApiError>({
    mutationFn: async () => {
      return apiClient.post<ApiSuccess<null>>('/auth/logout');
    },
    onSuccess: async (response) => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.auth.currentUser,
      });
      clearToken();
      queryClient.clear();
      return response.message;
    },
    onError: (error) => {
      return error.message;
    },
  });
};
