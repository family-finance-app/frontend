import {
  ChangePasswordFormData,
  ChangeEmailFormData,
  ChangePasswordFormErrors,
} from '../types';

export const validateChangePasswordForm = (
  formData: ChangePasswordFormData
): ChangePasswordFormErrors => {
  const newErrors: ChangePasswordFormErrors = {};

  if (!formData.oldPassword) {
    newErrors.oldPassword = 'Current password is required';
  }

  if (!formData.newPassword) {
    newErrors.newPassword = 'New password is required';
  } else if (formData.newPassword.length < 8)
    newErrors.newPassword = 'Password must be at least 8 characters';

  if (!formData.confirmPassword) {
    newErrors.confirmPassword = 'Confirm your new password';
  } else if (formData.newPassword !== formData.confirmPassword) {
    newErrors.confirmPassword = 'Passwords do not match';
  }

  return newErrors;
};

export const validateChangeEmailForm = (
  formData: ChangeEmailFormData,
  currentEmail: string
): Partial<ChangeEmailFormData> => {
  const newErrors: Partial<ChangeEmailFormData> = {};

  if (!/\S+@\S+\.\S+/.test(formData.newEmail))
    newErrors.newEmail = 'Enter a valid email, e.g: example@mail.com';

  if (!formData.newEmail) newErrors.newEmail = 'Email must not be empty';

  if (formData.newEmail === currentEmail) {
    newErrors.newEmail = 'New email must be different from current email';
  }

  return newErrors;
};
