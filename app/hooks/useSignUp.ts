import { useState } from 'react';
import { SignUpFormData, FormErrors } from '@/types/auth';
import { validateSignUpForm } from '@/utils/validation';
import { authAPI } from '@/services/authAPI';

export const useSignUp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState<string>('');

  const signUp = async (formData: SignUpFormData): Promise<boolean> => {
    // function returns false if validation of form data fails
    const validationErrors = validateSignUpForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return false;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await authAPI.signUp(formData);
      setSuccessMessage('Account created. Welcome to FamilyFinance');
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

  return { signUp, isLoading, errors, successMessage, clearError };
};
