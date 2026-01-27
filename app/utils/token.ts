// token utilities for api client

export const setAuthToken = (token: string) => {
  console.log('💾 setAuthToken called:', token.substring(0, 20) + '...');
  if (typeof window !== 'undefined') {
    localStorage.setItem('authToken', token);
    console.log('💾 Token saved to localStorage');
  }
};

export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('authToken');
    console.log(
      '🔑 getAuthToken called:',
      token ? token.substring(0, 20) + '...' : 'null',
    );
    return token;
  }
  return null;
};

export const clearAuthToken = () => {
  console.log('🗑️ clearAuthToken called');
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken');
    console.log('🗑️ Token removed from localStorage');
  }
};

export const hasAuthToken = (): boolean => {
  const has = !!getAuthToken();
  console.log('❓ hasAuthToken:', has);
  return has;
};
