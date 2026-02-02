export interface ChangePasswordFormData {
  oldPassword: string;
  newPassword: string;
  confirmPassword?: string;
}

export interface ChangePasswordFormErrors {
  oldPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
  general?: string;
}

export interface ChangeEmailFormData {
  newEmail: string;
}

export interface ChangeEmailFormErrors {
  newEmail?: string;
  general?: string;
}

export interface UpdatedPassword {
  id: number;
  email: string;
  updatedAt: string;
  accessToken: string;
  refreshIssued: boolean;
}

export interface UpdatedEmail extends UpdatedPassword {}
