import { useState } from 'react';
import { CreateAccountFormData } from '@/types/account';

/**
 * useAccountForm - управление состоянием формы для создания счета
 */
export function useAccountForm() {
  const getInitialFormData = (): CreateAccountFormData => ({
    name: '',
    type: 'BANK',
    balance: 0,
    currency: 'USD',
  });

  const [formData, setFormData] = useState<CreateAccountFormData>(
    getInitialFormData()
  );

  const setFormField = <K extends keyof CreateAccountFormData>(
    field: K,
    value: CreateAccountFormData[K]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const reset = () => {
    setFormData(getInitialFormData());
  };

  return {
    formData,
    setFormField,
    reset,
  };
}
