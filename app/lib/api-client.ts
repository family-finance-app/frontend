// requests configuration
// COMMENTED LINES ARE FOR LOCAL DEVELOPMENT
import { ApiError } from 'next/dist/server/api-utils';
import { getAuthToken, setAuthToken, clearAuthToken } from '@/utils';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
// const IS_DEV = process.env.NODE_ENV === 'development';
// const DEFAULT_BASE_URL = IS_DEV ? '/api' : BACKEND_URL;

export interface RequestConfig extends RequestInit {
  token?: string;
}

class APIClient {
  private baseURL: string | undefined;
  private refreshPromise: Promise<string | null> | null = null;

  // constructor(baseURL = DEFAULT_BASE_URL) {
  //   this.baseURL = baseURL;
  // }
  constructor(baseURL = BACKEND_URL) {
    this.baseURL = baseURL;
  }

  private async refreshToken(): Promise<string | null> {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = (async () => {
      try {
        const refreshUrl = `${this.baseURL}/auth/refresh`;

        const refreshResp = await fetch(refreshUrl, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });

        if (refreshResp.ok) {
          const refreshData = await refreshResp.json();

          const newAccess =
            (refreshData?.data as any)?.accessToken ||
            (refreshData as any)?.accessToken;

          if (newAccess) {
            console.log(newAccess.substring(0, 20) + '...');
            setAuthToken(newAccess);
            return newAccess;
          }
        }

        clearAuthToken();

        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('auth:logout'));
        }

        return null;
      } catch (e) {
        clearAuthToken();

        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('auth:logout'));
        }

        return null;
      } finally {
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

    // refresh handling
    if (response.status === 401) {
      const hadToken = !!resolvedToken;

      if (!hadToken) {
        const responseData = await response.json();
        throw {
          status: 401,
          ...responseData,
        } as ApiError & { status: number };
      }

      const newToken = await this.refreshToken();

      if (!newToken) {
        throw { status: 401, message: 'Unauthorized' } as ApiError & {
          status: number;
        };
      }

      console.log('Token refreshed');

      const retryHeaders: HeadersInit = {
        ...defaultHeaders,
        ...headers,
        Authorization: `Bearer ${newToken}`,
      };

      const retryResponse = await fetch(url, {
        ...restConfig,
        headers: retryHeaders,
        credentials: 'include',
        cache: restConfig.cache ?? 'no-store',
      });

      if (retryResponse.status === 204) {
        return {} as T;
      }

      const retryData = await retryResponse.json();

      if (!retryResponse.ok) {
        throw {
          status: retryResponse.status,
          ...retryData,
        } as ApiError & { status: number };
      }

      console.log('Retry successful');
      return retryData as T;
    }

    if (response.status === 204) {
      return {} as T;
    }

    const responseData = await response.json();

    if (!response.ok) {
      throw {
        status: response.status,
        ...responseData,
      } as ApiError & { status: number };
    }

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
