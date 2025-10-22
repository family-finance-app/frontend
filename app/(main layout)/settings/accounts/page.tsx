'use client';

import { useState } from 'react';
import CreateAccountForm from '@/components/accounts/CreateAccountForm';
import AccountsList from '@/components/accounts/AccountsList';

export default function AccountSettings() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [lastCreatedAccount, setLastCreatedAccount] = useState<string | null>(
    null
  );

  const showSuccessMessage = (accountName: string) => {
    setShowCreateForm(false);
    setLastCreatedAccount(accountName);
    setTimeout(() => setLastCreatedAccount(null), 3000);
  };
  return (
    <div className="space-y-6">
      {lastCreatedAccount && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
          New account successfully added!
        </div>
      )}

      <div className="flex justify-between items-center">
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg transition-colors"
        >
          {showCreateForm ? 'Cancel' : '+ Add new account'}
        </button>
      </div>

      {/* Create Account Form */}
      {showCreateForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            Create New Account
          </h3>

          <CreateAccountForm
            onSuccess={showSuccessMessage}
            onCancel={() => setShowCreateForm(false)}
          />
        </div>
      )}

      <AccountsList />
    </div>
  );
}
