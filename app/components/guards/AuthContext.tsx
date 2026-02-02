'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
  useRef,
} from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  getAuthToken,
  setAuthToken as saveToken,
  clearAuthToken as removeToken,
} from '@/utils';
import { queryKeys } from '@/lib/query-client';

interface AuthContextType {
  token: string | null;
  setToken: (token: string) => void;
  clearToken: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string | null>(() => getAuthToken());
  const queryClient = useQueryClient();
  const suppressAuthChangeRef = useRef(false);

  const invalidateProtectedData = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: queryKeys.auth.currentUser });
    queryClient.invalidateQueries({ queryKey: queryKeys.accounts.all });
    queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
    queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
    queryClient.invalidateQueries({ queryKey: queryKeys.profile.all });
    queryClient.invalidateQueries({ queryKey: queryKeys.exchangeRate.all });
  }, [queryClient]);

  const setToken = (newToken: string) => {
    suppressAuthChangeRef.current = true;
    saveToken(newToken);
    setTokenState(newToken);

    invalidateProtectedData();
  };

  const clearToken = useCallback(() => {
    suppressAuthChangeRef.current = true;
    removeToken();
    setTokenState(null);

    queryClient.clear();
  }, [queryClient]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'authToken') {
        const nextToken = e.newValue;
        const prevToken = token;
        setTokenState(nextToken);

        if (nextToken && !prevToken) {
          invalidateProtectedData();
        }

        if (!nextToken) {
          queryClient.clear();
        }
      }
    };

    const handleAuthChange = () => {
      if (suppressAuthChangeRef.current) {
        suppressAuthChangeRef.current = false;
        return;
      }
      const currentToken = getAuthToken();
      if (currentToken === token) {
        return;
      }
      setTokenState(currentToken);

      if (currentToken && !token) {
        invalidateProtectedData();
      }

      if (!currentToken) {
        queryClient.clear();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('authChanged', handleAuthChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authChanged', handleAuthChange);
    };
  }, [queryClient, invalidateProtectedData, token]);

  useEffect(() => {
    const handleLogout = () => {
      clearToken();
    };

    window.addEventListener('auth:logout', handleLogout);

    return () => {
      window.removeEventListener('auth:logout', handleLogout);
    };
  }, [clearToken]);

  return (
    <AuthContext.Provider
      value={{
        token,
        setToken,
        clearToken,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
