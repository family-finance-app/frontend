/**
 * useAuth hook
 * Provides authentication utilities and current user data
 */

'use client';

import { useCurrentUser } from '@/api/auth/queries';
import { useSignOut } from '@/api/auth/mutations';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const router = useRouter();
  const { data: user, isLoading } = useCurrentUser();
  const signOutMutation = useSignOut();

  const token =
    typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

  const isAuthenticated = !!token && !!user;

  const signOut = async () => {
    await signOutMutation.mutateAsync();
    router.push('/sign-in');
  };

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    signOut,
  };
}
