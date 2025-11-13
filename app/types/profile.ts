export interface User {
  id: number;
  email: string;
  passwordHash?: string;
  name?: string;
  role: string;
  birthdate: string;
  createdAt: string;
}

export interface UserResponse {
  message: string;
  user: User;
}
