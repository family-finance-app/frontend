/**
 * ХУК ДЛЯ РАБОТЫ С ТОКЕНОМ АУТЕНТИФИКАЦИИ
 *
 * Выносим логику работы с токеном в отдельную утилиту
 * вместо дублирования во всех хуках.
 */

/**
 * Получить токен из localStorage
 * @returns токен или null
 */
export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  return localStorage.getItem('authToken');
};

/**
 * Сохранить токен в localStorage
 * @param token - токен для сохранения
 */
export const setAuthToken = (token: string): void => {
  if (typeof window === 'undefined') {
    return;
  }
  localStorage.setItem('authToken', token);
};

/**
 * Удалить токен из localStorage
 */
export const clearAuthToken = (): void => {
  if (typeof window === 'undefined') {
    return;
  }
  localStorage.removeItem('authToken');
};

/**
 * Проверить есть ли токен
 * @returns true если токен есть
 */
export const hasAuthToken = (): boolean => {
  return !!getAuthToken();
};
