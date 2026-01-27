// contexts/auth-context.tsx
'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
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

  const invalidateProtectedData = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: queryKeys.auth.currentUser });
    queryClient.invalidateQueries({ queryKey: queryKeys.accounts.all });
    queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
    queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
    queryClient.invalidateQueries({ queryKey: queryKeys.profile.all });
    queryClient.invalidateQueries({ queryKey: queryKeys.exchangeRate.all });
  }, [queryClient]);

  const setToken = (newToken: string) => {
    console.log('🔐 AuthContext: Setting new token');
    saveToken(newToken);
    setTokenState(newToken);

    invalidateProtectedData();
  };

  const clearToken = () => {
    console.log('🔐 AuthContext: Clearing token');
    removeToken();
    setTokenState(null);

    // КРИТИЧНО: полностью очищаем весь кеш
    queryClient.clear();
  };

  // Слушаем изменения токена из других вкладок/источников
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'authToken') {
        console.log('🔐 AuthContext: Token changed in storage');
        setTokenState(e.newValue);

        if (e.newValue) {
          invalidateProtectedData();
        } else {
          queryClient.clear();
        }
      }
    };

    const handleAuthChange = () => {
      console.log('🔐 AuthContext: Auth changed event');
      const currentToken = getAuthToken();
      setTokenState(currentToken);

      if (currentToken) {
        invalidateProtectedData();
      } else {
        queryClient.clear();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('authChanged', handleAuthChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authChanged', handleAuthChange);
    };
  }, [queryClient, invalidateProtectedData]);

  useEffect(() => {
    const handleLogout = () => {
      console.log('🔐 AuthContext: Logout event received from API client');
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
