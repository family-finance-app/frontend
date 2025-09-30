import { useState } from 'react';
import { CreateAccountFormData } from '@/types/account';
import { FormErrors } from '@/types/auth';
import { validateCreateAccountForm } from '@/utils/validation';
import { accountAPI } from '@/services/accountAPI';

export const useCreateAccount = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState<string>('');

  const createAccount = async (
    formData: CreateAccountFormData
  ): Promise<boolean> => {
    // function returns false if validation of form data fails
    const validationErrors = validateCreateAccountForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return false;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await accountAPI.createAccount(formData);
      setSuccessMessage(`New ${formData.type} account created`);
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

  return { createAccount, isLoading, errors, successMessage, clearError };
};
