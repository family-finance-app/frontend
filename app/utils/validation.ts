import { SignUpFormData, SignInFormData, FormErrors } from '@/types/auth';
import { CreateAccountFormData } from '@/types/account';
import { CreateTransactionFormData } from '@/types/transaction';

// auth validation
export const validateEmail = (email: string): string | null => {
  if (!email) return 'Email is required';

  if (!/\S+@\S+\.\S+/.test(email))
    return 'Enter a valid email, e.g: example@mail.com'; // CHECK

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

// create new account validation
export const validateTitle = (title: string): string | null => {
  if (!title) return 'Account title is required';
  return null;
};

export const validateType = (type: string): string | null => {
  if (!type) return 'Choose account type';
  return null;
};

export const validateBalance = (balance: string): string | null => {
  if (!balance) return 'Indicate account balance or keep default 0.0';
  return null;
};

export const validateCreateAccountForm = (
  formData: CreateAccountFormData
): FormErrors => {
  const errors: FormErrors = {};

  const titleError = validateTitle(formData.title);
  if (titleError) errors.title = titleError;

  const typeError = validateTitle(formData.type);
  if (typeError) errors.type = typeError;

  const balanceError = validateTitle(formData.balance);
  if (balanceError) errors.balance = balanceError;

  return errors;
};

// create new transaction validation
export const validateCategory = (category: string): string | null => {
  if (!category) return 'Category is required';
  return null;
};

export const validateAmount = (amount: string): string | null => {
  if (!amount) return 'Transaction amount is required';
  return null;
};

export const validateCreateTransactionForm = (
  formData: CreateTransactionFormData
): FormErrors => {
  const errors: FormErrors = {};

  const categoryError = validateTitle(formData.categoryId);
  if (categoryError) errors.category = categoryError;

  const amountError = validateTitle(formData.amount);
  if (amountError) errors.type = amountError;

  return errors;
};
