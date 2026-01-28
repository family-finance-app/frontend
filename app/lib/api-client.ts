// requests configuration

import { ApiError } from 'next/dist/server/api-utils';
import { getAuthToken, setAuthToken, clearAuthToken } from '@/utils';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export interface RequestConfig extends RequestInit {
  token?: string;
}

class APIClient {
  private baseURL: string | undefined;
  private refreshPromise: Promise<string | null> | null = null;

  constructor(baseURL = BACKEND_URL) {
    this.baseURL = baseURL;
  }

  private async refreshToken(): Promise<string | null> {
    console.log('🔄 refreshToken: starting refresh...');

    if (this.refreshPromise) {
      console.log('🔄 refreshToken: reusing existing promise');
      return this.refreshPromise;
    }

    this.refreshPromise = (async () => {
      try {
        const refreshUrl = `${this.baseURL}/auth/refresh`;
        console.log('🔄 refreshToken: calling', refreshUrl);

        const refreshResp = await fetch(refreshUrl, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
            Pragma: 'no-cache',
          },
          cache: 'no-store',
        });

        console.log('🔄 refreshToken: response status', refreshResp.status);

        if (refreshResp.ok) {
          const refreshData = await refreshResp.json();
          console.log('🔄 refreshToken: response data', refreshData);

          const newAccess =
            (refreshData?.data as any)?.accessToken ||
            (refreshData as any)?.accessToken;

          if (newAccess) {
            console.log(
              '✅ refreshToken: got new token',
              newAccess.substring(0, 20) + '...',
            );
            setAuthToken(newAccess);
            return newAccess;
          }
        }

        console.log('❌ refreshToken: failed to get token, triggering logout');
        clearAuthToken();

        // КРИТИЧНО: dispatch события для logout
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('auth:logout'));
        }

        return null;
      } catch (e) {
        console.error('❌ refreshToken: error', e);
        clearAuthToken();

        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('auth:logout'));
        }

        return null;
      } finally {
        console.log('🔄 refreshToken: clearing promise');
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  private async request<T>(
    endpoint: string,
    config: RequestConfig = {},
  ): Promise<T> {
    const { token, headers, ...restConfig } = config;
    const url = `${this.baseURL}${endpoint}`;

    console.log(`📤 ${config.method || 'GET'} ${endpoint}`);

    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    };

    const resolvedToken = token || getAuthToken();

    if (resolvedToken) {
      defaultHeaders['Authorization'] = `Bearer ${resolvedToken}`;
    }

    let response = await fetch(url, {
      ...restConfig,
      headers: {
        ...defaultHeaders,
        ...headers,
      },
      credentials: 'include',
      cache: restConfig.cache ?? 'no-store',
    });

    console.log(`📥 ${endpoint} - ${response.status}`);

    // Обработка 401
    if (response.status === 401) {
      const hadToken = !!resolvedToken;

      if (!hadToken) {
        console.log('❌ 401: No token present');
        const responseData = await response.json();
        throw {
          status: 401,
          ...responseData,
        } as ApiError & { status: number };
      }

      console.log('🔄 401: Attempting refresh...');
      const newToken = await this.refreshToken();

      if (!newToken) {
        console.log('❌ Refresh failed');
        throw { status: 401, message: 'Unauthorized' } as ApiError & {
          status: number;
        };
      }

      console.log('✅ Refresh successful, retrying with new token');

      // КРИТИЧНО: делаем НОВЫЙ fetch с новым токеном
      // Не переиспользуем старый response!
      const retryHeaders: HeadersInit = {
        ...defaultHeaders,
        ...headers,
        Authorization: `Bearer ${newToken}`,
      };

      // НОВЫЙ fetch запрос
      const retryResponse = await fetch(url, {
        ...restConfig,
        headers: retryHeaders,
        credentials: 'include',
        cache: restConfig.cache ?? 'no-store',
      });

      console.log(`📥 RETRY ${endpoint} - ${retryResponse.status}`);

      // Обработка retry response
      if (retryResponse.status === 204) {
        return {} as T;
      }

      const retryData = await retryResponse.json();

      if (!retryResponse.ok) {
        console.log('❌ Retry failed:', retryResponse.status, retryData);
        if (retryResponse.status === 401) {
          clearAuthToken();
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('auth:logout'));
          }
        }
        throw {
          status: retryResponse.status,
          ...retryData,
        } as ApiError & { status: number };
      }

      console.log('✅ Retry successful');
      return retryData as T;
    }

    // Обработка 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    // Обработка всех остальных ответов
    const responseData = await response.json();

    if (!response.ok) {
      console.log('❌ Request failed:', response.status, responseData);
      throw {
        status: response.status,
        ...responseData,
      } as ApiError & { status: number };
    }

    console.log('✅ Request successful');
    return responseData as T;
  }

  async get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  async externalGet<T>(
    absoluteUrl: string,
    config?: RequestConfig,
  ): Promise<T> {
    const { token, headers, ...restConfig } = config || {};
    const defaultHeaders: HeadersInit = {};

    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(absoluteUrl, {
      ...restConfig,
      method: 'GET',
      headers: {
        ...defaultHeaders,
        ...headers,
      },
      cache: restConfig.cache ?? 'no-store',
    });

    if (response.status === 204) {
      return {} as T;
    }

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    const responseData = await response.json();
    return responseData as T;
  }

  async post<T>(
    endpoint: string,
    body?: unknown,
    config?: RequestConfig,
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async put<T>(
    endpoint: string,
    body?: unknown,
    config?: RequestConfig,
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async patch<T>(
    endpoint: string,
    body?: unknown,
    config?: RequestConfig,
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }
}

export const apiClient = new APIClient();
