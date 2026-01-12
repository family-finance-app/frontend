import { CreateAccountFormData } from '../types';

export function validateCreateAccountForm(
  formData: CreateAccountFormData
): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!formData.name.trim()) {
    errors.name = 'Account name is required';
  } else if (formData.name.length > 50) {
    errors.name = 'Account name must be less than 50 characters';
  }

  if (isNaN(Number(formData.balance))) {
    errors.balance = 'Balance must be a valid number';
  } else if (Number(formData.balance) < 0) {
    errors.balance = 'Balance cannot be negative';
  }

  return errors;
}

export function handleCreateAccountErrors(
  error: unknown
): Record<string, string> {
  const errorMap: Record<string, string> = {};

  if (error instanceof Error) {
    if (error.message.includes('already exists')) {
      errorMap.name = 'Account with this name already exists';
    } else {
      errorMap.submit = error.message;
    }
  } else if (error && typeof error === 'object' && 'details' in error) {
    const details = error.details as Array<{
      path: string[];
      message: string;
    }>;
    details.forEach((err) => {
      errorMap[err.path[0]] = err.message;
    });
  } else {
    errorMap.submit = 'Failed to create account. Please try again.';
  }

  return errorMap;
}
