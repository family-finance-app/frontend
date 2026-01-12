'use client';

import { useState } from 'react';
import {
  CreateAccountFormData,
  currencyList,
  SELECT_ACCOUNT_TYPES,
} from '@/(main layout)/accounts/types';
import { useCreateAccount } from '@/api/accounts/mutations';
import { useAccountForm } from '@/hooks/useAccountForm';
import {
  validateCreateAccountForm,
  handleCreateAccountErrors,
} from '@/(main layout)/accounts/utils/validation';
import { FormActions, FormInput, FormSelectList } from '@/components/shared';
import AccountPreview from './AccountPreview';
import { RiErrorWarningLine } from '@remixicon/react';
import FormSelectGrid from '../../../components/shared/forms/FormSelectGrid';

interface CreateAccountFormProps {
  onSuccess?: (accountName: string) => void;
  onError?: (errorMessage: string) => void;
  onCancel?: () => void;
}

export default function CreateAccountForm({
  onSuccess,
  onError,
  onCancel,
}: CreateAccountFormProps) {
  const createMutation = useCreateAccount();
  const { formData, setFormField, reset } = useAccountForm();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedCurrency = currencyList.find(
    (curr) => curr.value === formData.currency
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const validationErrors = validateCreateAccountForm(formData);
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

      onSuccess?.(formData.name);
      reset();
    } catch (error) {
      const createAccountErrors = handleCreateAccountErrors(error);
      setErrors(createAccountErrors);

      const errorMessage =
        createAccountErrors.submit || 'Failed to create account';
      onError?.(errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormInput
        label={{ type: 'accountName', text: 'Account Name' }}
        name="accountName"
        type="text"
        id="accountName"
        value={formData.name}
        onChange={(e) => setFormField('name', e.target.value)}
        error={errors.name}
        placeholder="e.g., Revolut Debit Card"
        required
        classname="internal"
      />

      <FormSelectGrid
        label={{ htmlFor: 'accountType', text: 'Account Type' }}
        name="accountType"
        id="accountType"
        value={formData.type}
        options={SELECT_ACCOUNT_TYPES}
        onChange={(type) =>
          setFormField('type', type as CreateAccountFormData['type'])
        }
        error={errors.type}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          label={{ type: 'balance', text: 'Initial Balance' }}
          span={selectedCurrency?.symbol || '₴'}
          name="balance"
          type="number"
          id="balance"
          value={formData.balance === 0 ? '' : formData.balance}
          onChange={(e) =>
            setFormField('balance', parseFloat(e.target.value) || 0)
          }
          error={errors.balance}
          placeholder="0.00"
          required
          classname="internal"
        />

        <FormSelectList
          label="Currency"
          name="currency"
          value={formData.currency}
          onChange={(currency) =>
            setFormField(
              'currency',
              currency as CreateAccountFormData['currency']
            )
          }
          options={currencyList}
          error={errors.currency}
        />
      </div>

      {errors.submit && (
        <div className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-xl">
          <div className="flex items-center space-x-2">
            <RiErrorWarningLine />
            <span className="font-medium">{errors.submit}</span>
          </div>
        </div>
      )}

      <FormActions
        submitLabel={
          createMutation.isPending ? 'Creating...' : 'Create Account'
        }
        isLoading={createMutation.isPending}
        onCancel={onCancel}
      />

      <AccountPreview
        name={formData.name}
        accountType={formData.type}
        balance={formData.balance}
        currency={formData.currency}
      />
    </form>
  );
}
