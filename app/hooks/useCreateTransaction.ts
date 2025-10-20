import { useState } from 'react';
import { CreateTransactionFormData } from '@/types/transaction';
import { FormErrors } from '@/types/auth';
import { validateCreateTransactionForm } from '@/utils/validation';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const useCreateTransaction = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState<string>('');

  const createTransaction = async (
    formData: CreateTransactionFormData
  ): Promise<boolean> => {
    // function returns false if validation of form data fails
    const validationErrors = validateCreateTransactionForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return false;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await fetch(`${BACKEND_URL}/api/transaction`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: formData.type,
          amount: parseFloat(formData.amount),
          date: formData.date,
          userId: 1, // TODO: get from auth context
          groupId: formData.groupId ? parseInt(formData.groupId) : null,
          accountId: formData.accountId ? parseInt(formData.accountId) : 1,
          categoryId: parseInt(formData.categoryId),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setErrors(data.errors);
        return false;
      }

      setSuccessMessage('Transaction added');
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);

      return true;
    } catch (error: any) {
      if (error.error === 'Validation failed' && error.details) {
        const backendErrors: FormErrors = {};
        error.details.forEach((err: { path: string[]; message: string }) => {
          backendErrors[err.path[0]] = err.message;
        });
        setErrors(backendErrors);
      } else {
        setErrors({ general: error.message || 'Error' });
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  return { createTransaction, isLoading, errors, successMessage, clearError };
};
