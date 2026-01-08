import { useState, useCallback, useMemo } from 'react';
import type { Transaction, CreateTransactionFormData } from '../types';
import { Category } from '@/types/category';
import type { Account } from '@/types/account';
import { useCreateTransaction } from '@/api/transactions/mutations';
import { dateFormatters } from '@/utils/formatters';

interface UseCreateTransactionFormReturn {
  formData: CreateTransactionFormData;
  setFormData: (data: CreateTransactionFormData) => void;
  errors: Record<string, string>;
  isPending: boolean;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  resetForm: () => void;
}

export default function useCreateTransactionForm(
  onSuccess?: (transaction: Transaction) => void
): UseCreateTransactionFormReturn {
  const createMutation = useCreateTransaction();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const initialFormData = useMemo(
    () => ({
      accountId: 0,
      type: 'EXPENSE' as any,
      amount: 0,
      categoryId: 0,
      currency: 'UAH' as any,
      date: dateFormatters.today(),
    }),
    []
  );

  const [formData, setFormData] =
    useState<CreateTransactionFormData>(initialFormData);

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if (!formData.accountId) {
      newErrors.accountId = 'Please select an account';
    }

    if (!formData.categoryId) {
      newErrors.categoryId = 'Please select a category';
    }

    if (!formData.amount || formData.amount < 0.01) {
      newErrors.amount = 'Amount must be at least 0.01';
    }

    if (!dateFormatters.isValidFormat(formData.date)) {
      newErrors.date = 'Please enter date in format DD.MM.YYYY';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setErrors({});

      if (!validateForm()) {
        return;
      }

      try {
        const result = await createMutation.mutateAsync(formData);
        onSuccess?.(result);
        setFormData(initialFormData);
      } catch (error) {
        if (error && typeof error === 'object' && 'details' in error) {
          const backendErrors: Record<string, string> = {};
          const details = error.details as Array<{
            path: string[];
            message: string;
          }>;
          details.forEach((err) => {
            backendErrors[err.path[0]] = err.message;
          });
          setErrors(backendErrors);
        } else {
          const message =
            error instanceof Error
              ? error.message
              : 'Failed to create transaction';
          setErrors({ general: message });
        }
      }
    },
    [formData, validateForm, onSuccess, createMutation, initialFormData]
  );

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setErrors({});
  }, [initialFormData]);

  return {
    formData,
    setFormData,
    errors,
    isPending: createMutation.isPending,
    handleSubmit,
    resetForm,
  };
}
