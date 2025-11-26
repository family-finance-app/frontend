'use client';

import { useState } from 'react';
import { CreateAccountFormData } from '@/types/account';
import { useCreateAccount } from '@/api/accounts/mutations';
import { useAccountForm } from '@/hooks/useAccountForm';
import { useAccountValidation } from '@/hooks/useAccountValidation';
import { FormActions } from '@/components/shared/forms';
import {
  AccountNameInput,
  AccountBalanceInput,
  CurrencySelect,
  CURRENCIES,
} from './AccountInputs';
import { AccountTypeSelect, ACCOUNT_TYPES } from './AccountTypeSelect';
import { AccountPreview } from './AccountPreview';
import { roboto } from '@/assets/fonts/fonts';

interface CreateAccountFormProps {
  onSuccess?: (accountName: string) => void;
  onCancel?: () => void;
}

export default function CreateAccountForm({
  onSuccess,
  onCancel,
}: CreateAccountFormProps) {
  const createMutation = useCreateAccount();
  const { formData, setFormField, reset } = useAccountForm();
  const { validateForm, handleBackendErrors } = useAccountValidation();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedCurrency = CURRENCIES.find(
    (curr) => curr.value === formData.currency
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const accountData = {
        name: formData.name,
        type: formData.type as
          | 'DEBIT'
          | 'CREDIT'
          | 'CASH'
          | 'BANK'
          | 'INVESTMENT'
          | 'DEPOSIT'
          | 'DIGITAL'
          | 'SAVINGS',
        balance: Number(formData.balance),
        currency: formData.currency as 'UAH' | 'USD' | 'EUR',
      };

      const result = await createMutation.mutateAsync(accountData);
      console.log('Account created:', result);

      onSuccess?.(formData.name);
      reset();
    } catch (error) {
      const backendErrors = handleBackendErrors(error);
      setErrors(backendErrors);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <AccountNameInput
        value={formData.name}
        onChange={(name) => setFormField('name', name)}
        error={errors.name}
      />

      <AccountTypeSelect
        value={formData.type}
        onChange={(type) =>
          setFormField('type', type as CreateAccountFormData['type'])
        }
        error={errors.type}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AccountBalanceInput
          value={formData.balance}
          onChange={(balance) => setFormField('balance', balance)}
          symbol={selectedCurrency?.symbol || '₴'}
          error={errors.balance}
        />

        {/* Currency */}
        <CurrencySelect
          value={formData.currency}
          onChange={(currency) =>
            setFormField(
              'currency',
              currency as CreateAccountFormData['currency']
            )
          }
          error={errors.currency}
        />
      </div>

      {/* Form Errors */}
      {errors.submit && (
        <div className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-xl">
          <div className="flex items-center space-x-2">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="font-medium">{errors.submit}</span>
          </div>
        </div>
      )}

      {/* Form Actions */}
      <FormActions
        submitLabel={
          createMutation.isPending ? 'Creating...' : 'Create Account'
        }
        isLoading={createMutation.isPending}
        onCancel={onCancel}
      />

      {/* Account Preview */}
      <AccountPreview
        name={formData.name}
        accountType={formData.type}
        balance={formData.balance}
        currency={formData.currency}
      />
    </form>
  );
}
