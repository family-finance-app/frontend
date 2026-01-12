'use client';

import { useState } from 'react';
import { CreateAccountForm, AccountsGridSection } from './components/index';
import { FinancialCard } from '@/components/shared';
import Button from '@/components/ui/Button_financial';
import { roboto } from '@/assets/fonts/fonts';
import { useMyAccounts } from '@/api/accounts/queries';
import { accountStatsByGroup } from './utils';
import { RiGroupLine, RiUserLine } from '@remixicon/react';
import SuccessMessage from '@/components/ui/SuccessMessage';
import ErrorMessage from '@/components/ui/ErrorMessage';

export default function Accounts() {
  const { data: accounts = [] } = useMyAccounts();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [lastCreatedAccount, setLastCreatedAccount] = useState<string | null>(
    null
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<'personal' | 'family'>(
    'personal'
  );

  const showSuccessMessage = (accountName: string) => {
    setShowCreateForm(false);
    setLastCreatedAccount(accountName);
    setErrorMessage(null);
    setTimeout(() => setLastCreatedAccount(null), 5000);
  };

  const showErrorMessage = (error: string) => {
    setErrorMessage(error);
    setTimeout(() => setErrorMessage(null), 5000);
  };

  const personalAccounts = accountStatsByGroup(accounts, 'personal');
  const familyAccounts = accountStatsByGroup(accounts, 'family');

  return (
    <div className="space-y-12">
      {lastCreatedAccount && (
        <div role="status">
          <SuccessMessage
            message={`Account "${lastCreatedAccount}" successfully created!`}
          />
        </div>
      )}

      {errorMessage && (
        <div role="alert">
          <ErrorMessage message={errorMessage} />
        </div>
      )}
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
        <button
          onClick={() => setActiveSection('personal')}
          className={`text-left transition-all ${
            activeSection === 'personal'
              ? 'ring-3 ring-primary-300 dark:ring-primary-600 rounded-2xl'
              : ''
          }`}
        >
          <FinancialCard
            title="Personal Accounts"
            value={personalAccounts.totalCount.toString()}
            description="Your accounts"
            size="md"
            className="h-full cursor-pointer"
            icon={<RiUserLine />}
          />
        </button>

        <button
          onClick={() => setActiveSection('family')}
          className={`text-left transition-all ${
            activeSection === 'family'
              ? 'ring-3 ring-primary-300 dark:ring-primary-600 rounded-2xl'
              : ''
          }`}
        >
          <FinancialCard
            title="Family Accounts"
            value={familyAccounts.totalCount.toString()}
            description="Shared accounts"
            size="md"
            className="h-full cursor-pointer"
            icon={<RiGroupLine />}
          />
        </button>
      </section>

      {showCreateForm && (
        <div className="bg-white dark:bg-background-100 rounded-2xl shadow-financial border border-background-100 p-6 animate-scale-in">
          <div className="flex justify-between">
            <h3
              className={`${roboto.className} text-lg font-semibold mb-6 text-primary-800`}
            >
              Create New Account
            </h3>
          </div>
          <CreateAccountForm
            onSuccess={showSuccessMessage}
            onError={showErrorMessage}
            onCancel={() => setShowCreateForm(false)}
          />
        </div>
      )}

      {personalAccounts.totalCount > 0 && activeSection === 'personal' && (
        <section aria-labelledby="personal-accounts">
          <h2 id="personal-accounts" className="sr-only">
            Personal Accounts
          </h2>
          <AccountsGridSection
            accounts={personalAccounts.accounts}
            onClick={() => setShowCreateForm(true)}
          />
        </section>
      )}

      {familyAccounts.totalCount > 0 && activeSection === 'family' && (
        <section aria-labelledby="family-accounts">
          <h2 id="family-accounts" className="sr-only">
            Family Accounts
          </h2>
          <AccountsGridSection
            accounts={familyAccounts.accounts}
            onClick={() => setShowCreateForm(true)}
          />
        </section>
      )}
    </div>
  );
}
