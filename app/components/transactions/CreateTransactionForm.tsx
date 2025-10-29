'use client';

import { useState } from 'react';
import {
  CreateTransactionFormData,
  TransactionType,
  CurrencyType,
} from '@/types/transaction';
import { useCategories } from '@/api/categories/queries';
import { useMyAccounts } from '@/api/accounts/queries';
import { useCreateTransaction } from '@/api/transactions/mutations';
import { roboto } from '@/assets/fonts/fonts';
import { FormInput, FormSelect, FormActions } from '@/components/shared/forms';
import type { SelectOption } from '@/components/shared/forms/FormSelect';

interface CreateTransactionFormProps {
  onSuccess: (transactionId: number) => void;
  onCancel?: () => void;
  onError?: () => void;
}

export default function CreateTransactionForm({
  onSuccess,
  onCancel,
  onError,
}: CreateTransactionFormProps) {
  const [type, setType] = useState<'INCOME' | 'EXPENSE' | 'TRANSFER'>(
    'EXPENSE'
  );
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [accountId, setAccountId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: categories = [] } = useCategories();
  const { data: accounts = [] } = useMyAccounts();
  const createMutation = useCreateTransaction();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Простая валидация
    const newErrors: Record<string, string> = {};
    if (!amount) newErrors.amount = 'Amount is required';
    if (!accountId) newErrors.accountId = 'Account is required';
    if (type !== 'TRANSFER' && !categoryId)
      newErrors.categoryId = 'Category is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const formData: CreateTransactionFormData = {
      type: type as TransactionType,
      amount: parseFloat(amount),
      date: new Date().toISOString().split('T')[0],
      currency: CurrencyType.UAH,
      description,
      accountId,
      categoryId,
    };

    createMutation.mutate(formData, {
      onSuccess: (data: any) => {
        onSuccess(data.id || 0);
      },
      onError: () => {
        onError?.();
      },
    });
  };

  // Convert accounts to options
  const accountOptions: SelectOption[] = (accounts || []).map((account) => ({
    value: account.id,
    label: account.name,
  }));

  // Convert categories to options
  const categoryOptions: SelectOption[] = (categories || [])
    .filter((cat) => {
      if (type === 'TRANSFER') return false;
      return cat.type.toUpperCase() === type;
    })
    .map((cat) => ({
      value: cat.id,
      label: cat.name,
    }));

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Transaction Type */}
      <div>
        <label
          className={`${roboto.className} block text-sm font-medium text-background-900 mb-2`}
        >
          Type
        </label>
        <div className="flex gap-3">
          {(['INCOME', 'EXPENSE', 'TRANSFER'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                type === t
                  ? 'bg-primary-600 text-white'
                  : 'bg-background-100 text-background-700 hover:bg-background-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Amount */}
      <FormInput
        label="Amount"
        name="amount"
        type="number"
        placeholder="0.00"
        value={amount}
        onChange={setAmount}
        error={errors.amount}
      />

      {/* Account */}
      <FormSelect
        label="Account"
        name="accountId"
        value={accountId}
        onChange={setAccountId}
        options={accountOptions}
        placeholder="Select an account"
        error={errors.accountId}
      />

      {/* Category */}
      {type !== 'TRANSFER' && (
        <FormSelect
          label="Category"
          name="categoryId"
          value={categoryId}
          onChange={setCategoryId}
          options={categoryOptions}
          placeholder="Select a category"
          error={errors.categoryId}
        />
      )}

      {/* Description */}
      <FormInput
        label="Description"
        name="description"
        type="text"
        placeholder="Add a note..."
        value={description}
        onChange={setDescription}
      />

      {/* Actions */}
      <FormActions
        onCancel={onCancel}
        submitLabel={
          createMutation.isPending ? 'Creating...' : 'Create Transaction'
        }
        cancelLabel="Cancel"
        isLoading={createMutation.isPending}
      />
    </form>
  );
}
