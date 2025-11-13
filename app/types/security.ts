import { User } from './profile';

export interface PasswordChangeFormData {
  oldPassword: string;
  newPassword: string;
}

export interface EmailChangeFormData {
  newEmail: User['email'];
}

export interface SecurityUpdateResponse {
  message: string;
  data: Partial<User>;
}
