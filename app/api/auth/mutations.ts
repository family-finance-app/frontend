'use client';

// Sign up, sign in, and sign out operations

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-client';
import { SignUpFormData, SignInFormData, AuthResponse } from '@/types/auth';
import { getAuthToken, setAuthToken, clearAuthToken } from '@/utils/token';

// sign up, returns AuthResponse type with token
export const useSignUp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      formData: Partial<SignUpFormData>
    ): Promise<AuthResponse> => {
      return apiClient.post<AuthResponse>('/api/auth/signup', {
        email: formData.email,
        password: formData.password,
        terms: formData.terms,
        role: 'MEMBER',
      });
    },
    onSuccess: (data) => {
      if (data.accessToken) {
        setAuthToken(data.accessToken);
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.currentUser });
    },
    onError: (error) => {
      console.error('Sign up failed:', error);
    },
  });
};

// login
export const useSignIn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: SignInFormData): Promise<AuthResponse> => {
      return apiClient.post<AuthResponse>('/api/auth/login', {
        email: formData.email,
        password: formData.password,
      });
    },
    onSuccess: (data) => {
      if (data.accessToken) {
        setAuthToken(data.accessToken);
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.currentUser });
    },
    onError: (error) => {
      console.error('Sign in failed:', error);
    },
  });
};

// log out
export const useSignOut = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<void> => {
      const token = getAuthToken();
      await apiClient.post<void>(
        '/api/auth/logout',
        {},
        {
          token: token || undefined,
        }
      );
      clearAuthToken();
    },
    onSuccess: () => {
      queryClient.clear();
    },
  });
};
