import { useState } from 'react';
import { SignInFormData, FormErrors } from '@/types/auth';
import { validateSignInForm } from '@/utils/validation';
import { authAPI } from '@/services/authAPI';

export const useSignIn = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState<string>('');

  const signIn = async (formData: SignInFormData): Promise<boolean> => {
    const loginValidationErrors = validateSignInForm(formData);

    if (Object.keys(loginValidationErrors).length > 0) {
      setErrors(loginValidationErrors);
      return false;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await authAPI.signIn(formData);
      setSuccessMessage('Welcome back!');
      setTimeout(() => {
        setSuccessMessage('');
      }, 1500);

      return true;
    } catch (error: any) {
      setErrors({ general: error.message || 'Login failed' });
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

  return { signIn, isLoading, errors, successMessage, clearError };
};
