'use client';

import { useState, useEffect } from 'react';
import {
  Account,
  ACCOUNT_TYPES,
  EditAccountFormData,
} from '@/(main layout)/accounts/types';
import { FormErrors } from '@/types/auth';
import { roboto } from '@/assets/fonts/fonts';
import Button from '@/components/ui/Button_financial';
import { accountTypeName } from '@/(main layout)/accounts/utils/';
import { validateEditAccountForm } from '@/utils/validation';

interface EditAccountFormProps {
  account: Account;
  isOpen: boolean;
  onClose: () => void;
  onSave: (accountId: number, data: EditAccountFormData) => Promise<void>;
}
const CURRENCY_OPTIONS = ['USD', 'EUR', 'UAH'] as const;

export function EditAccountForm({
  account,
  isOpen,
  onClose,
  onSave,
}: EditAccountFormProps) {
  const [formData, setFormData] = useState<EditAccountFormData>({
    name: account?.name || '',
    type: account?.type || 'BANK',
    currency: account?.currency || 'UAH',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (account) {
      setFormData({
        name: account.name || '',
        type: account.type || 'BANK',
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
    setFormErrors((prev) => {
      if (!prev[name]) return prev;
      const nextErrors = { ...prev };
      delete nextErrors[name];
      return nextErrors;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setFormErrors({});
    setIsLoading(true);

    try {
      const validationErrors = validateEditAccountForm(formData);
      if (Object.keys(validationErrors).length > 0) {
        setFormErrors(validationErrors);
        setIsLoading(false);
        return;
      }
      await onSave(account.id, formData);
      onClose();
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : 'Failed to save account'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="bg-background-50 border border-background-200 rounded-2xl p-6 mt-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3
          className={`${roboto.className} text-lg font-bold text-primary-800`}
        >
          Edit Account
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {submitError && (
          <div className="bg-danger-50 border border-danger-200 rounded-lg p-3">
            <p className="text-danger-700 text-sm font-medium">{submitError}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              aria-invalid={Boolean(formErrors.name)}
              aria-describedby={formErrors.name ? 'name-error' : undefined}
              className="w-full px-3 py-2 border border-background-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-background-50 disabled:text-background-500"
              placeholder="My Checking Account"
            />
            {formErrors.name && (
              <p id="name-error" className="mt-1 text-sm text-danger-600">
                {formErrors.name}
              </p>
            )}
          </div>

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
              aria-invalid={Boolean(formErrors.type)}
              aria-describedby={formErrors.type ? 'type-error' : undefined}
              className="w-full px-3 py-2 border border-background-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-background-50 disabled:text-background-500"
            >
              {ACCOUNT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {accountTypeName(type)}
                </option>
              ))}
            </select>
            {formErrors.type && (
              <p id="type-error" className="mt-1 text-sm text-danger-600">
                {formErrors.type}
              </p>
            )}
          </div>

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
              aria-invalid={Boolean(formErrors.currency)}
              aria-describedby={
                formErrors.currency ? 'currency-error' : undefined
              }
              className="w-full px-3 py-2 border border-background-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-background-50 disabled:text-background-500 uppercase"
            >
              {CURRENCY_OPTIONS.map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
            {formErrors.currency && (
              <p id="currency-error" className="mt-1 text-sm text-danger-600">
                {formErrors.currency}
              </p>
            )}
          </div>
        </div>

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
