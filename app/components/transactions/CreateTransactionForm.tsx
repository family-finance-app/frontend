'use client';

import { useState } from 'react';
import {
  CreateTransactionFormData,
  CreateTransferFormData,
  TransactionType,
  CurrencyType,
} from '@/types/transaction';
import { useCategories } from '@/api/categories/queries';
import { useMyAccounts } from '@/api/accounts/queries';
import { useCreateTransaction } from '@/api/transactions/mutations';
import { useCreateTransfer } from '@/api/transactions/mutations';
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
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [accountId, setAccountId] = useState('');
  const [accountRecipientId, setAccountRecipientId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: categories = [] } = useCategories();
  const { data: accounts = [] } = useMyAccounts();
  const createMutation = useCreateTransaction();
  const createTransferMutation = useCreateTransfer();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!amount) newErrors.amount = 'Amount is required';
    if (!date) newErrors.date = 'Date is required';

    if (type === 'TRANSFER') {
      if (!accountId) newErrors.accountId = 'Source account is required';
      if (!accountRecipientId)
        newErrors.accountRecipientId = 'Recipient account is required';
      if (accountId === accountRecipientId)
        newErrors.accountRecipientId =
          'Source and recipient accounts must be different';

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      const transferData: CreateTransferFormData = {
        accountId: parseInt(accountId),
        accountRecipientId: parseInt(accountRecipientId),
        amount: parseFloat(amount),
        currency: CurrencyType.UAH,
        date,
        description,
        categoryId: parseInt(categoryId) || 68,
      };

      createTransferMutation.mutate(transferData, {
        onSuccess: (data: any) => {
          onSuccess(data.transaction?.id || 0);
        },
        onError: () => {
          onError?.();
        },
      });
    } else {
      if (!accountId) newErrors.accountId = 'Account is required';
      if (!categoryId) newErrors.categoryId = 'Category is required';

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      const formData: CreateTransactionFormData = {
        type: type as TransactionType,
        amount: parseFloat(amount),
        date,
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
    }
  };

  const accountOptions: SelectOption[] = (accounts || []).map((account) => ({
    value: account.id,
    label: account.name,
  }));

  const categoryOptions: SelectOption[] = (categories || [])
    .filter((cat) => {
      if (type === 'TRANSFER') return false;
      return cat.type.toUpperCase() === type;
    })
    .map((cat) => ({
      value: cat.id,
      label: cat.name,
    }));

  const isLoading =
    createMutation.isPending || createTransferMutation.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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

      <FormInput
        label={{ type: 'amount', text: 'Amount' }}
        name="amount"
        type="number"
        placeholder="0.00"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        error={errors.amount}
      />

      <FormInput
        label={{ type: 'date', text: 'Date' }}
        name="date"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        error={errors.date}
      />

      {type === 'TRANSFER' ? (
        <>
          <FormSelect
            label="From Account"
            name="accountId"
            value={accountId}
            onChange={setAccountId}
            options={accountOptions}
            placeholder="Select source account"
            error={errors.accountId}
          />

          <FormSelect
            label="To Account"
            name="accountRecipientId"
            value={accountRecipientId}
            onChange={setAccountRecipientId}
            options={accountOptions.filter((opt) => opt.value !== accountId)}
            placeholder="Select recipient account"
            error={errors.accountRecipientId}
          />
        </>
      ) : (
        <>
          <FormSelect
            label="Account"
            name="accountId"
            value={accountId}
            onChange={setAccountId}
            options={accountOptions}
            placeholder="Select an account"
            error={errors.accountId}
          />

          <FormSelect
            label="Category"
            name="categoryId"
            value={categoryId}
            onChange={setCategoryId}
            options={categoryOptions}
            placeholder="Select a category"
            error={errors.categoryId}
          />
        </>
      )}

      <FormInput
        label={{ type: 'description', text: 'Description' }}
        name="description"
        type="text"
        placeholder="Add a note..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <FormActions
        onCancel={onCancel}
        submitLabel={isLoading ? 'Creating...' : 'Create Transaction'}
        cancelLabel="Cancel"
        isLoading={isLoading}
      />
    </form>
  );
}
