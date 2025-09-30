export interface SignUpFormData {
  email: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
}

export interface SignInFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface FormErrors {
  [key: string]: string;
}

export interface User {
  id: number;
  email: string;
  role: string;
  createdAt: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token?: string;
}

export interface ApiError {
  error: string;
  message: string;
  details?: Array<{
    path: string[];
    message: string;
  }>;
}
