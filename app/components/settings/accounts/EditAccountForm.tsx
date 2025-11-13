'use client';

import { useState, useEffect } from 'react';
import { Account } from '@/types/account';
import { roboto } from '@/assets/fonts/fonts';
import Button from '@/components/ui/Button_financial';
import {
  getAccountTypeName,
  type AccountType,
  ACCOUNT_TYPES,
  CURRENCY_OPTIONS,
} from '@/utils/accounts';

interface EditAccountFormProps {
  account: Account;
  isOpen: boolean;
  onClose: () => void;
  onSave: (accountId: number, data: EditAccountFormData) => Promise<void>;
}

export interface EditAccountFormData {
  name: string;
  type: AccountType;
  currency: string;
}

export function EditAccountForm({
  account,
  isOpen,
  onClose,
  onSave,
}: EditAccountFormProps) {
  const [formData, setFormData] = useState<EditAccountFormData>({
    name: account?.name || '',
    type: (account?.type as AccountType) || 'BANK',
    currency: account?.currency || 'USD',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (account) {
      setFormData({
        name: account.name || '',
        type: (account.type as AccountType) || 'BANK',
        currency: account.currency || 'USD',
      });
    }
  }, [account]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Validate form data
      if (!formData.name.trim()) {
        setError('Account name is required');
        setIsLoading(false);
        return;
      }

      if (!formData.currency.trim()) {
        setError('Currency is required');
        setIsLoading(false);
        return;
      }

      // Call API through parent component
      await onSave(account.id, formData);

      // Close form on success
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save account');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="bg-background-50 border border-background-200 rounded-2xl p-6 mt-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3
          className={`${roboto.className} text-lg font-bold text-background-900`}
        >
          Edit Account
        </h3>
        <button
          onClick={onClose}
          className="text-background-500 hover:text-background-900 transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Error Message */}
        {error && (
          <div className="bg-danger-50 border border-danger-200 rounded-lg p-3">
            <p className="text-danger-700 text-sm font-medium">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Account Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-background-700 mb-1"
            >
              Account Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-background-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-background-50 disabled:text-background-500"
              placeholder="My Checking Account"
            />
          </div>

          {/* Account Type */}
          <div>
            <label
              htmlFor="type"
              className="block text-sm font-medium text-background-700 mb-1"
            >
              Account Type
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-background-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-background-50 disabled:text-background-500"
            >
              {ACCOUNT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {getAccountTypeName(type)}
                </option>
              ))}
            </select>
          </div>

          {/* Currency */}
          <div>
            <label
              htmlFor="currency"
              className="block text-sm font-medium text-background-700 mb-1"
            >
              Currency
            </label>
            <select
              id="currency"
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-background-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-background-50 disabled:text-background-500 uppercase"
            >
              {CURRENCY_OPTIONS.map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3 pt-4 ">
          <Button
            text="Cancel"
            type="button"
            variant="outline"
            size="md"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            text={isLoading ? 'Saving...' : 'Save Changes'}
            type="submit"
            variant="primary"
            size="md"
            disabled={isLoading}
            className="flex-1"
          />
        </div>
      </form>
    </div>
  );
}
