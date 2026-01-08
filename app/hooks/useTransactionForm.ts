import { useState, useCallback } from 'react';
import {
  CreateTransactionFormData,
  TransactionType,
  CurrencyType,
} from '@/types/transaction';

interface UseTransactionFormReturn {
  formData: CreateTransactionFormData;
  setFormField: (field: keyof CreateTransactionFormData, value: any) => void;
  reset: () => void;
}

const getInitialFormData = (): CreateTransactionFormData => {
  const today = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');

  return {
    type: TransactionType.EXPENSE,
    amount: 0,
    date: `${pad(today.getDate())}.${pad(
      today.getMonth() + 1
    )}.${today.getFullYear()}`,
    categoryId: 0,
    accountId: 0,
    currency: CurrencyType.UAH,
  };
};

export function useTransactionForm(): UseTransactionFormReturn {
  const [formData, setFormDataState] = useState<CreateTransactionFormData>(
    getInitialFormData()
  );

  const setFormField = useCallback(
    (field: keyof CreateTransactionFormData, value: any) => {
      setFormDataState((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    []
  );

  const reset = useCallback(() => {
    setFormDataState(getInitialFormData());
  }, []);

  return {
    formData,
    setFormField,
    reset,
  };
}
