// token utilities for api client

// check if we're in browser (for local development, nodejs25 issues)
const isBrowser = (): boolean => {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
};

export const getAuthToken = (): string | null => {
  if (!isBrowser()) {
    return null;
  }
  try {
    return localStorage.getItem('authToken');
  } catch (e) {
    console.warn('Failed to access localStorage:', e);
    return null;
  }
};

export const setAuthToken = (token: string): void => {
  if (!isBrowser()) {
    return;
  }
  try {
    localStorage.setItem('authToken', token);
  } catch (e) {
    console.warn('Failed to set token in localStorage:', e);
  }
};

export const clearAuthToken = (): void => {
  if (!isBrowser()) {
    return;
  }
  try {
    localStorage.removeItem('authToken');
  } catch (e) {
    console.warn('Failed to clear token from localStorage:', e);
  }
};

export const hasAuthToken = (): boolean => {
  return !!getAuthToken();
};
