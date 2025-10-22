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

  const titleError = validateTitle(formData.name);
  if (titleError) errors.title = titleError;

  const typeError = validateType(formData.type);
  if (typeError) errors.type = typeError;

  const balanceError = validateBalance(String(formData.balance));
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

  const categoryError = validateCategory(String(formData.categoryId));
  if (categoryError) errors.category = categoryError;

  const amountError = validateAmount(String(formData.amount));
  if (amountError) errors.amount = amountError;

  return errors;
};
