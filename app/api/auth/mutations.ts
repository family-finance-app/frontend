// sign up, sign in, and sign out operations

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-client';
import { SignUpFormData, SignInFormData, AuthResponse } from '@/types/auth';

// sign-up hook
export const useSignUp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: SignUpFormData): Promise<AuthResponse> => {
      return apiClient.post<AuthResponse>('/api/auth/signup', {
        email: formData.email,
        password: formData.password,
        role: 'MEMBER',
      });
    },
    onSuccess: (data) => {
      if (data.accessToken) {
        localStorage.setItem('authToken', data.accessToken);
      }
      // invalidate and refetch current user query
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.currentUser });
    },
    onError: (error) => {
      console.error('Sign up failed:', error);
    },
  });
};

// sign-in hook
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
        localStorage.setItem('authToken', data.accessToken);
      }
      // invalidate and refetch current user query
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.currentUser });
    },
    onError: (error) => {
      console.error('Sign in failed:', error);
    },
  });
};

// sign-out
export const useSignOut = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<void> => {
      await apiClient.post('/api/auth/logout');
      localStorage.removeItem('authToken');
    },
    onSuccess: () => {
      queryClient.clear();
    },
  });
};
