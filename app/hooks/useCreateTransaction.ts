import { useState } from 'react';
import { CreateTransactionFormData } from '@/types/transaction';
import { FormErrors } from '@/types/auth';
import { validateCreateTransactionForm } from '@/utils/validation';
import { transactionAPI } from '@/services/transactionAPI';

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
      const response = await transactionAPI.createTransaction(formData);
      setSuccessMessage(`New transaction created`);
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
        setErrors({ general: error.message || 'Registration failed' });
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
