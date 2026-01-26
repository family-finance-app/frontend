import { SignUpFormData, SignInFormData, FormErrors } from '@/(auth)/types';

export const validateEmail = (email: string): string | null => {
  if (!email) return 'Email is required';

  if (!/\S+@\S+\.\S+/.test(email))
    return 'Enter a valid email, e.g: example@mail.com';

  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password) return 'Password is required';

  if (password.length < 8) return 'Password must be at least 8 characters';

  return null;
};

export const validateSignUpForm = (formData: SignUpFormData): FormErrors => {
  const errors: FormErrors = {};

  const emailError = validateEmail(formData.email);
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(formData.password);
  if (passwordError) errors.password = passwordError;

  if (!formData.confirmPassword)
    errors.confirmPassword = 'Confirm your password';
  else if (formData.password !== formData.confirmPassword)
    errors.confirmPassword = 'Passwords do not match';

  if (!formData.terms) errors.terms = 'You must accept terms and conditions';

  return errors;
};

export const validateSignInForm = (formData: SignInFormData): FormErrors => {
  const errors: FormErrors = {};

  const emailError = validateEmail(formData.email);
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(formData.password);
  if (passwordError) errors.password = passwordError;

  return errors;
};
