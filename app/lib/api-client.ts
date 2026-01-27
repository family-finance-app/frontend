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
    if (this.refreshPromise) {
      return this.refreshPromise;
    }
    this.refreshPromise = (async () => {
      try {
        console.debug('[api-client] starting refresh');
        const refreshUrl = `${this.baseURL}/auth/refresh`;
        const refreshResp = await fetch(refreshUrl, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });
        console.debug('[api-client] refresh response status', {
          status: refreshResp.status,
        });
        if (refreshResp.ok) {
          const refreshData = await refreshResp.json();
          const newAccess =
            (refreshData?.data as any)?.accessToken ||
            (refreshData as any)?.accessToken;
          console.debug('[api-client] refresh response data', {
            accessToken: newAccess
              ? `${String(newAccess).slice(0, 10)}...`
              : null,
          });
          if (newAccess) {
            setAuthToken(newAccess);
            return newAccess;
          }
        }
        clearAuthToken();
        return null;
      } catch (e) {
        console.debug('[api-client] refresh error', e);
        clearAuthToken();
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
    };

    const resolvedToken = token || getAuthToken();
    if (resolvedToken) {
      defaultHeaders['Authorization'] = `Bearer ${resolvedToken}`;
    }

    console.debug('[api-client] Request', {
      endpoint,
      token: resolvedToken ? `${String(resolvedToken).slice(0, 10)}...` : null,
      method: restConfig.method || 'GET',
    });

    let response = await fetch(url, {
      ...restConfig,
      headers: {
        ...defaultHeaders,
        ...headers,
      },
      credentials: 'include',
    });

    // debug: log response status for tracing
    console.debug('[api-client] Response', {
      endpoint,
      status: response.status,
    });

    if (response.status === 401) {
      console.debug('[api-client] 401 received', {
        endpoint,
        token: resolvedToken
          ? `${String(resolvedToken).slice(0, 10)}...`
          : null,
      });
      const hadToken = !!resolvedToken;

      if (!hadToken) {
        const responseData = await response.json();
        throw {
          status: 401,
          ...responseData,
        } as ApiError & { status: number };
      }

      const newToken = await this.refreshToken();
      console.debug('[api-client] refresh result', {
        endpoint,
        newToken: newToken ? `${String(newToken).slice(0, 10)}...` : null,
      });

      if (!newToken) {
        throw { status: 401, message: 'Unauthorized' } as ApiError & {
          status: number;
        };
      }

      const retryHeaders: HeadersInit = {
        ...defaultHeaders,
        ...headers,
        Authorization: `Bearer ${newToken}`,
      };

      response = await fetch(url, {
        ...restConfig,
        headers: retryHeaders,
        credentials: 'include',
      });
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
