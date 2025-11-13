'use client';

import { useState } from 'react';
import { Account } from '@/types/account';
import { roboto } from '@/assets/fonts/fonts';
import Button from '@/components/ui/Button_financial';
import { ACCOUNT_TYPES, type AccountType } from '@/utils/accounts';

interface EditAccountModalProps {
  account: Account | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (accountId: number, data: EditAccountFormData) => Promise<void>;
}

export interface EditAccountFormData {
  name: string;
  type: AccountType;
  currency: string;
  initialBalance?: number;
  description?: string;
}

export function EditAccountModal({
  account,
  isOpen,
  onClose,
  onSave,
}: EditAccountModalProps) {
  const [formData, setFormData] = useState<EditAccountFormData>({
    name: account?.name || '',
    type: (account?.type as AccountType) || 'BANK',
    currency: account?.currency || 'USD',
    description: account?.description || '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !account) return null;

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

      // Close modal on success
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-background-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-scale-in border border-background-200">
        {/* Header */}
        <div className="border-b border-background-100 p-6">
          <h2
            className={`${roboto.className} text-2xl font-bold text-background-900`}
          >
            Edit Account
          </h2>
          <p className="text-background-600 text-sm mt-1">
            Update your account information
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Error Message */}
          {error && (
            <div className="bg-danger-50 border border-danger-200 rounded-lg p-3">
              <p className="text-danger-700 text-sm font-medium">{error}</p>
            </div>
          )}

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
                  {type}
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
            <input
              type="text"
              id="currency"
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-background-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-background-50 disabled:text-background-500 uppercase"
              placeholder="USD"
              maxLength={3}
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-background-700 mb-1"
            >
              Description (Optional)
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              disabled={isLoading}
              rows={3}
              className="w-full px-3 py-2 border border-background-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-background-50 disabled:text-background-500 resize-none"
              placeholder="Add notes about this account..."
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center space-x-3 pt-4 border-t border-background-100">
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
    </div>
  );
}
