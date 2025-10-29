// centralized API client for all backend requests that handles authentication, error handling and request configuration

import { ApiError } from '@/types/auth';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export interface RequestConfig extends RequestInit {
  token?: string;
}

class APIClient {
  private baseURL: string;

  constructor(baseURL: string = BACKEND_URL || 'http://localhost') {
    this.baseURL = baseURL;
  }

  // generic request method that handles all HTTP calls
  private async request<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<T> {
    const { token, headers, ...restConfig } = config;

    const url = `${this.baseURL}${endpoint}`;

    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...restConfig,
      headers: {
        ...defaultHeaders,
        ...headers,
      },
    });

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

    if (
      responseData &&
      typeof responseData === 'object' &&
      'data' in responseData &&
      'status' in responseData
    ) {
      return responseData.data as T;
    }

    return responseData as T;
  }

  // GET
  async get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  // POST
  async post<T>(
    endpoint: string,
    body?: unknown,
    config?: RequestConfig
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  // PUT
  async put<T>(
    endpoint: string,
    body?: unknown,
    config?: RequestConfig
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  // PATCH
  async patch<T>(
    endpoint: string,
    body?: unknown,
    config?: RequestConfig
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  // DELETE
  async delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }
}

export const apiClient = new APIClient();
