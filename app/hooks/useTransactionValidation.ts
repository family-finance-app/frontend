/**
 * useTransactionValidation - хук для валидации формы
 * Вынесена вся логика проверок и обработки ошибок
 */

import { useCallback } from 'react';
import { CreateTransactionFormData } from '@/types/transaction';

export interface ValidationErrors {
  [key: string]: string;
}

export function useTransactionValidation() {
  const validateForm = useCallback(
    (formData: CreateTransactionFormData): ValidationErrors => {
      const errors: ValidationErrors = {};

      if (!formData.accountId) {
        errors.accountId = 'Please select an account';
      }

      if (!formData.categoryId) {
        errors.categoryId = 'Please select a category';
      }

      if (!formData.amount || formData.amount < 0.01) {
        errors.amount = 'Amount must be at least 0.01';
      }

      const datePattern = /^\d{2}\.\d{2}\.\d{4}$/;
      if (!datePattern.test(formData.date)) {
        errors.date = 'Please enter date in format DD.MM.YYYY';
      }

      return errors;
    },
    []
  );

  const handleBackendErrors = useCallback(
    (error: unknown): ValidationErrors => {
      const backendErrors: ValidationErrors = {};

      if (error && typeof error === 'object' && 'details' in error) {
        const details = error.details as Array<{
          path: string[];
          message: string;
        }>;
        details.forEach((err) => {
          backendErrors[err.path[0]] = err.message;
        });
      } else {
        const message =
          error instanceof Error
            ? error.message
            : 'Failed to create transaction';
        backendErrors.general = message;
      }

      return backendErrors;
    },
    []
  );

  return { validateForm, handleBackendErrors };
}
