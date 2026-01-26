import { User } from '@/(main layout)/settings/profile/types';

export interface SignUpFormData {
  email: string;
  password: string;
  confirmPassword?: string;
  terms: boolean;
}

export interface SignInFormData {
  email: string;
  password: string;
}

export interface FormErrors {
  [key: string]: string;
}

export interface NewUser extends User {
  accessToken: string;
  refreshIssued: boolean;
}

export interface Login {
  id: number;
  email: string;
  accessToken: string;
  refreshIssued: boolean;
}

export interface CurrentUser extends User {}

export interface Login {}
