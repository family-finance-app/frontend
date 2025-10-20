'use client';

import { useState } from 'react';
import { CreateAccountFormData } from '@/types/account';
import Button from '../ui/Button';
// import { useAccounts } from '@/api/accounts/queries';
import { useCreateAccount } from '@/api/accounts/mutations';

interface CreateAccountFormProps {
  onSuccess?: (accountName: string) => void;
  onCancel?: () => void;
}

export default function CreateAccountForm({
  onSuccess,
  onCancel,
}: CreateAccountFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<CreateAccountFormData>({
    name: '',
    type: 'DEBIT',
    balance: 0.0,
    currency: 'UAH',
  });

  //   const { data: accounts } = useAccounts();
  const createMutation = useCreateAccount();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrors({});

    try {
      const accountData = {
        name: formData.name,
        type: formData.type as
          | 'DEBIT'
          | 'CREDIT'
          | 'CASH'
          | 'BANK'
          | 'INVESTMENT'
          | 'DEPOSIT',
        balance: Number(formData.balance),
        currency: formData.currency as 'UAH' | 'USD' | 'EUR',
      };

      const result = await createMutation.mutateAsync(accountData);

      console.log(result);

      setFormData({
        name: '',
        type: 'DEBIT',
        balance: 0.0,
        currency: 'UAH',
      });

      // Handle different response formats
      //   let accountName = 'Account';
      //   if (result && typeof result === 'object') {
      //     if ('account' in result && result.account) {
      //       accountName = result.account.name;
      //     } else if ('name' in result && typeof result.name === 'string') {
      //       accountName = result.name;
      //     }
      //   }

      onSuccess?.(result.account?.name);
    } catch (error) {
      if (error && typeof error === 'object' && 'details' in error) {
        const backendErrors: Record<string, string> = {};
        const details = error.details as Array<{
          path: string[];
          message: string;
        }>;
        details.forEach((err) => {
          backendErrors[err.path[0]] = err.message;
        });
        setErrors(backendErrors);
      } else {
        const message =
          error instanceof Error
            ? error.message
            : 'Failed to create transaction';
        setErrors({ general: message });
      }
    }
  };
  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Error message*/}
        {errors.general && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {errors.general}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Account Title
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g., Main Checking"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Account Type
            </label>
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  type: e.target.value as CreateAccountFormData['type'],
                })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              required
            >
              <option value="">Select type</option>
              <option value="DEBIT">Debit Card</option>
              <option value="CREDIT">Credit Card</option>
              <option value="CASH">Cash</option>
              <option value="BANK">Bank Account</option>
              <option value="INVESTMENT">Investment Account</option>
              <option value="DEPOSIT">Deposit Account</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Initial Balance
            </label>
            <input
              type="number"
              step="100.00"
              value={formData.balance}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  balance: parseFloat(e.target.value),
                })
              }
              placeholder="0.00"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Currency
            </label>
            <select
              value={formData.currency}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  currency: e.target.value as CreateAccountFormData['currency'],
                })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="UAH">UAH</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
          </div>
        </div>

        {/*Buttons*/}
        <div className="flex gap-3">
          {/* Submit */}
          <Button
            type="submit"
            disabled={createMutation.isPending}
            text="Create account"
          />
          {/* Cancel */}
          <Button
            type="button"
            disabled={createMutation.isPending}
            text="Cancel"
            variant="cancel"
            onClick={onCancel}
          />
        </div>

        {/* Form Errors */}
        {Object.keys(errors).length > 0 && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            <ul className="list-disc list-inside space-y-1">
              {Object.entries(errors).map(([field, message]) => (
                <li key={field}>{message}</li>
              ))}
            </ul>
          </div>
        )}
      </form>
    </>
  );
}
