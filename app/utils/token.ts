// token utilities for api client

// utils/auth.ts

export const setAuthToken = (token: string) => {
  console.log('💾 setAuthToken called:', token.substring(0, 20) + '...');
  if (typeof window !== 'undefined') {
    localStorage.setItem('authToken', token);
    console.log('💾 Token saved to localStorage');

    // Dispatch события для уведомления других компонентов
    window.dispatchEvent(new Event('authChanged'));
  }
};

export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('authToken');
    // Убираем лог - он вызывается слишком часто
    // console.log('🔑 getAuthToken called:', token ? token.substring(0, 20) + '...' : 'null');
    return token;
  }
  return null;
};

export const clearAuthToken = () => {
  console.log('🗑️ clearAuthToken called');
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken');
    console.log('🗑️ Token removed from localStorage');

    // Dispatch события
    window.dispatchEvent(new Event('authChanged'));
  }
};

export const hasAuthToken = (): boolean => {
  return !!getAuthToken();
};
