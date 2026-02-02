import { CreateAccountFormData, EditAccountFormData } from '../types';

export const validateTitle = (title: string): string | null => {
  if (!title) return 'Account title is required';
  if (title.length > 50) return 'Account name must be less than 50 characters';
  return null;
};

export const validateType = (type: string): string | null => {
  if (!type) return 'Choose account type';
  return null;
};

export const validateBalance = (balance: string): string | null => {
  if (!balance) return 'Indicate account balance or keep default 0.0';
  if (isNaN(Number(balance))) return 'Balance must be a valid number';
  if (Number(balance) < 0) return 'Balance cannot be negative';
  return null;
};

export function validateCreateAccountForm(
  formData: CreateAccountFormData,
): Record<string, string> {
  const errors: Record<string, string> = {};

  const titleError = validateTitle(formData.name);
  if (titleError) errors.name = titleError;

  const typeError = validateType(formData.type);
  if (typeError) errors.type = typeError;

  const balanceError = validateBalance(String(formData.balance));
  if (balanceError) errors.balance = balanceError;

  return errors;
}

export const validateEditAccountForm = (
  formData: EditAccountFormData,
): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!formData.name.trim()) {
    errors.name = 'Account name is required';
  } else if (formData.name.length > 50) {
    errors.name = 'Account name must be less than 50 characters';
  }

  if (!formData.currency.trim()) {
    errors.currency = 'Choose account currency';
  }

  if (!formData.type.trim()) {
    errors.type = 'Choose account type';
  }

  return errors;
};

export function handleCreateAccountErrors(
  error: unknown,
): Record<string, string> {
  const errorMap: Record<string, string> = {};

  if (error && typeof error === 'object') {
    if ('message' in error && typeof error.message === 'string') {
      errorMap.submit = error.message;
      return errorMap;
    }
  }

  if (error instanceof Error) errorMap.submit = error.message;
  else {
    errorMap.submit = 'Failed to create account. Please try again.';
  }

  return errorMap;
}
