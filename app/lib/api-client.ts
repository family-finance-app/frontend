// requests configuration

// TODO: FIX LOGIc OF REFRESH REQUEST
import { ApiError } from 'next/dist/server/api-utils';
import { getAuthToken, setAuthToken, clearAuthToken } from '@/utils';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export interface RequestConfig extends RequestInit {
  token?: string;
}

let refreshPromise: Promise<string | null> | null = null;

class APIClient {
  private baseURL: string | undefined;

  constructor(baseURL = BACKEND_URL) {
    this.baseURL = baseURL;
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

    const response = await fetch(url, {
      ...restConfig,
      headers: {
        ...defaultHeaders,
        ...headers,
      },
      credentials: 'include',
    });

    if (response.status === 401) {
      // attempt refresh
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
            setAuthToken(newAccess);

            const retryHeaders: HeadersInit = {
              ...defaultHeaders,
              ...headers,
              Authorization: `Bearer ${newAccess}`,
            };

            const retryResp = await fetch(url, {
              ...restConfig,
              headers: retryHeaders,
            });

            if (retryResp.status === 204) return {} as T;
            const retryData = await retryResp.json();
            if (!retryResp.ok) {
              throw { status: retryResp.status, ...retryData } as ApiError & {
                status: number;
              };
            }
            return retryData as T;
          }
        }
      } catch (e) {}

      clearAuthToken();
      throw { status: 401, message: 'Unauthorized' } as ApiError & {
        status: number;
      };
    }

    if (response.status === 204) {
      return {} as T;
    }

    const responseData = await response.json();

    if (response.status === 401) {
      if (!refreshPromise) {
        refreshPromise = (async () => {
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
                setAuthToken(newAccess);
                return newAccess;
              }
            }
            return null;
          } catch (e) {
            return null;
          }
        })();
      }
      const newAccess = await refreshPromise;
      refreshPromise = null;
      if (newAccess) {
        const retryHeaders: HeadersInit = {
          ...defaultHeaders,
          ...headers,
          Authorization: `Bearer ${newAccess}`,
        };
        const retryResp = await fetch(url, {
          ...restConfig,
          headers: retryHeaders,
          credentials: 'include',
        });
        if (retryResp.status === 204) return {} as T;
        const retryData = await retryResp.json();
        if (!retryResp.ok) {
          throw { status: retryResp.status, ...retryData } as ApiError & {
            status: number;
          };
        }
        return retryData as T;
      }
      clearAuthToken();
      throw { status: 401, message: 'Unauthorized' } as ApiError & {
        status: number;
      };
    }

    throw {
      status: 500,
      message: 'Unexpected error in APIClient.request',
    } as ApiError & {
      status: number;
    };
  }

  async get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  // external api GET request
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
    if (!response.ok) throw new Error(`Request failed: ${response.status}`);
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
