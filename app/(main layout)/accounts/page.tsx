'use client';

import { useState } from 'react';
import CreateAccountForm from '@/components/accounts/CreateAccountForm';
import FinancialCard from '@/(main layout)/dashboard/cards/FinancialCard';
import Button from '@/components/ui/Button_financial';
import { roboto } from '@/assets/fonts/fonts';
import { useMyAccounts } from '@/api/accounts/queries';
import {
  PersonalAccountsSection,
  FamilyAccountsSection,
} from '@/components/accounts';
import {
  getPersonalAccounts,
  getFamilyAccounts,
  calculateAccountStats,
} from '@/utils/accounts';

export default function Accounts() {
  const { data: accounts = [] } = useMyAccounts();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [lastCreatedAccount, setLastCreatedAccount] = useState<string | null>(
    null
  );

  const showSuccessMessage = (accountName: string) => {
    setShowCreateForm(false);
    setLastCreatedAccount(accountName);
    setTimeout(() => setLastCreatedAccount(null), 3000);
  };

  const personalAccounts = getPersonalAccounts(accounts);
  const familyAccounts = getFamilyAccounts(accounts);

  const personalStats = calculateAccountStats(personalAccounts);
  const familyStats = calculateAccountStats(familyAccounts);

  return (
    <div className="space-y-12">
      {lastCreatedAccount && (
        <div
          role="status"
          className="bg-success-50 border border-success-200 text-success-700 px-4 py-3 rounded-xl animate-fade-in"
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:space-x-2">
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
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="font-medium">
              Account "{lastCreatedAccount}" successfully created!
            </span>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1
            className={`${roboto.className} text-3xl font-bold text-primary-800 mb-2`}
          >
            Financial Accounts
          </h1>
          <p className="text-primary-800">
            Update or delete your accounts from Manage Accounts page
          </p>
        </div>

        <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3">
          <Button
            text="Manage Accounts"
            type="button"
            variant="outline"
            size="md"
            className="w-full sm:w-auto"
            onClick={() => (window.location.href = '/settings/accounts')}
          />
          <Button
            text={showCreateForm ? 'Cancel' : '+ Add Account'}
            type="button"
            variant={showCreateForm ? 'outline' : 'primary'}
            size="md"
            className="w-full sm:w-auto"
            onClick={() => setShowCreateForm(!showCreateForm)}
          />
        </div>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FinancialCard
          title="Personal Accounts"
          value={personalStats.totalCount.toString()}
          description="Your accounts"
          size="md"
          className="h-full"
          icon={
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          }
        />

        <FinancialCard
          title="Family Accounts"
          value={familyStats.totalCount.toString()}
          description="Shared accounts"
          size="md"
          className="h-full"
          icon={
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-2a6 6 0 0112 0v2zm0 0h6v-2a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          }
        />
      </section>

      {/* Create Account Form */}
      {showCreateForm && (
        <div className="bg-white dark:bg-background-100 rounded-2xl shadow-financial border border-background-100 p-6 animate-scale-in">
          <div className="flex justify-between">
            <h3
              className={`${roboto.className} text-lg font-semibold mb-6 text-primary-800`}
            >
              Create New Account
            </h3>
            <p className="text-sm dark:text-stack-600">* required fields</p>
          </div>
          <CreateAccountForm
            onSuccess={showSuccessMessage}
            onCancel={() => setShowCreateForm(false)}
          />
        </div>
      )}

      {personalAccounts.length > 0 && (
        <section aria-labelledby="personal-accounts">
          <h2 id="personal-accounts" className="sr-only">
            Personal Accounts
          </h2>
          <PersonalAccountsSection accounts={personalAccounts} />
        </section>
      )}

      {familyAccounts.length > 0 && (
        <section aria-labelledby="family-accounts">
          <h2 id="family-accounts" className="sr-only">
            Family Accounts
          </h2>
          <FamilyAccountsSection accounts={familyAccounts} />
        </section>
      )}
    </div>
  );
}
