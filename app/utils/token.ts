// token utilities for api client

// utils/auth.ts

export const setAuthToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('authToken', token);

    window.dispatchEvent(new Event('authChanged'));
  }
};

export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('authToken');

    return token;
  }
  return null;
};

export const clearAuthToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken');

    window.dispatchEvent(new Event('authChanged'));
  }
};

export const hasAuthToken = (): boolean => {
  return !!getAuthToken();
};
