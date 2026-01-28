'use client';

import { useState } from 'react';

import {
  CreateTransferFormData,
  CreateTransactionFormData,
  TransactionType,
  CurrencyType,
} from '../types';

import { useMainData } from '@/(main layout)/data/MainDataProvider';
import { useCreateTransaction } from '@/api/transactions/mutations';
import { useCreateTransfer } from '@/api/transactions/mutations';
import { showGlobalSuccess, showGlobalError } from '@/lib/global-alerts';
import { type ExchangeRateMap } from '@/api/exchangeRate/queries';
import { convertToUAH } from '@/utils';

import {
  FormInput,
  FormActions,
  FormSelectList,
  SuccessMessage,
} from '@/components';

import { roboto } from '@/assets/fonts/fonts';

interface CreateTransactionFormProps {
  onSuccess: (transactionId: number) => void;
  onCancel?: () => void;
  onError?: () => void;
}

export default function CreateTransactionModal({
  onSuccess,
  onCancel,
  onError,
}: CreateTransactionFormProps) {
  const [type, setType] = useState<'INCOME' | 'EXPENSE' | 'TRANSFER'>(
    'EXPENSE',
  );
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [accountId, setAccountId] = useState('');
  const [accountRecipientId, setAccountRecipientId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState('');

  const { categories, accounts, exchangeRates } = useMainData();

  const createMutation = useCreateTransaction();
  const createTransferMutation = useCreateTransfer();

  const findAccountCurrency = (id: string): CurrencyType | undefined => {
    const account = accounts.find((acc) => acc.id === Number(id));
    return account?.currency as CurrencyType | undefined;
  };

  const senderCurrency = findAccountCurrency(accountId) || CurrencyType.UAH;
  const recipientCurrency =
    findAccountCurrency(accountRecipientId) || CurrencyType.UAH;

  const convertBetweenCurrencies = (
    value: number,
    from: string,
    to: string,
  ): number => {
    const fromCurrency = from?.toUpperCase() || 'UAH';
    const toCurrency = to?.toUpperCase() || 'UAH';

    if (fromCurrency === toCurrency) return value;

    if (!exchangeRates) return value;
    const amountUAH = convertToUAH(value, fromCurrency, exchangeRates);
    const targetRate = exchangeRates[
      toCurrency as keyof typeof exchangeRates
    ] as number | undefined;
    if (!targetRate || targetRate === 0) return amountUAH;
    return amountUAH / Number(targetRate);
  };

  const amountNumber = Number(amount) || 0;
  const shouldShowConvertedTransferAmount =
    type === 'TRANSFER' &&
    !!accountId &&
    !!accountRecipientId &&
    senderCurrency !== recipientCurrency &&
    amountNumber > 0;

  const convertedTransferAmount = shouldShowConvertedTransferAmount
    ? convertBetweenCurrencies(amountNumber, senderCurrency, recipientCurrency)
    : 0;

  const amountLabelCurrency =
    type === 'TRANSFER' ? senderCurrency : findAccountCurrency(accountId);
  const amountLabelText = amountLabelCurrency
    ? `Amount (${amountLabelCurrency})`
    : 'Amount';

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

      const numericAmount = parseFloat(amount);

      const transferData: CreateTransferFormData = {
        accountId: parseInt(accountId, 10),
        accountRecipientId: parseInt(accountRecipientId, 10),
        amount: numericAmount,
        currency: senderCurrency,
        date,
        description,
        categoryId: parseInt(categoryId),
      };

      createTransferMutation.mutate(transferData, {
        onSuccess: (data: any) => {
          onSuccess(data?.transaction?.id ?? 0);
          setSuccess('Transaction created successfully');
          showGlobalSuccess('Transaction created successfully');
        },
        onError: () => {
          onError?.();
          setErrors(newErrors);
          showGlobalError('Failed to create transaction');
        },
      });
    } else {
      if (!accountId) newErrors.accountId = 'Account is required';
      if (!categoryId) newErrors.categoryId = 'Category is required';

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      const payload: CreateTransactionFormData = {
        type: type as TransactionType,
        amount: parseFloat(amount),
        date,
        currency: senderCurrency,
        description,
        accountId: parseInt(accountId),
        categoryId: parseInt(categoryId),
      };

      createMutation.mutate(payload, {
        onSuccess: (data: any) => {
          onSuccess(data.id || 0);
          showGlobalSuccess('Transaction created successfully');
        },
        onError: () => {
          onError?.();
          showGlobalError('Failed to create transaction');
        },
      });
    }
  };

  const accountOptions: Array<{ value: string | number; label: string }> = (
    accounts || []
  ).map((account) => ({
    value: account.id,
    label: account.name,
  }));

  const categoryOptions: Array<{ value: string | number; label: string }> = (
    categories || []
  )
    .filter((cat) => {
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
          className={`${roboto.className} block text-sm font-medium text-background-900 dark:text-primary-800 mb-2`}
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
                  ? 'bg-primary-600 text-background-50'
                  : 'bg-background-100 text-background-700 hover:bg-background-200 dark:hover:bg-primary-600 dark:hover:text-background-100'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <FormInput
        label={{ type: 'amount', text: amountLabelText }}
        name="amount"
        type="number"
        placeholder="0.00"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        error={errors.amount}
        classname="internal"
      />

      {shouldShowConvertedTransferAmount && (
        <p className="text-xs text-background-500 dark:text-background-400">
          ≈ {convertedTransferAmount.toFixed(2)} {recipientCurrency} will be
          received
        </p>
      )}

      <FormInput
        label={{ type: 'date', text: 'Date' }}
        name="date"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        error={errors.date}
        classname="internal"
      />

      {type === 'TRANSFER' ? (
        <>
          <FormSelectList
            label={{ type: 'accountSender', text: 'From Account' }}
            name="accountId"
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
            options={accountOptions}
            placeholder="Select source account"
            error={errors.accountId}
          />

          <FormSelectList
            label={{ type: 'accountRecipient', text: 'To Account' }}
            name="accountRecipientId"
            value={accountRecipientId}
            onChange={(e) => setAccountRecipientId(e.target.value)}
            options={accountOptions.filter((opt) => opt.value !== accountId)}
            placeholder="Select recipient account"
            error={errors.accountRecipientId}
          />
        </>
      ) : (
        <>
          <FormSelectList
            label={{ type: 'account', text: 'Account' }}
            name="accountId"
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
            options={accountOptions}
            placeholder="Select an account"
            error={errors.accountId}
          />
        </>
      )}

      <FormSelectList
        label={{ type: 'category', text: 'Category' }}
        name="categoryId"
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
        options={categoryOptions}
        placeholder="Select a category"
        error={errors.categoryId}
      />

      <FormInput
        label={{ type: 'description', text: 'Description (Optional)' }}
        name="description"
        type="text"
        placeholder="Add a the description to new transaction..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        classname="internal"
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
