import {
  SignUpFormData,
  SignInFormData,
  AuthResponse,
  ApiError,
} from '@/types/auth';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

class AuthAPI {
  private async request<T>(endpoint: string, options: RequestInit): Promise<T> {
    const url = `${BACKEND_URL}${endpoint}`;

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options, // CHECK
    });

    const data = await response.json();

    if (!response.ok) {
      throw {
        status: response.status,
        ...data,
      } as ApiError & { status: number };
    }

    return data as T;
  }

  // sign up class method
  async signUp(formData: SignUpFormData): Promise<AuthResponse> {
    return this.request<AuthResponse>('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
        role: 'MEMBER',
      }),
    });
  }

  // sign in class method
  async signIn(formData: SignInFormData): Promise<AuthResponse> {
    return this.request<AuthResponse>('/api/auth/signin', {
      method: 'POST',
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
      }),
    });
  }
}

export const authAPI = new AuthAPI();
