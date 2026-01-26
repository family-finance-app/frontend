export interface ChangeProfileFormData {
  name: string;
  birthdate: string;
}

export interface User {
  id: number;
  email: string;
  terms?: boolean;
  name?: string;
  birthdate?: string;
  role?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface UpdatedUser {
  id: number;
  email: number;
  name: string;
  birthdate: string;
  updatedAt: string;
}
