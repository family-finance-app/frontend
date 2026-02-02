import React from 'react';
import { roboto } from '@/assets/fonts/fonts';
import { Button } from '@/components';

export const AccountsHeader: React.FC<{
  showCreateForm: boolean;
  setShowCreateForm: (v: boolean) => void;
}> = ({ showCreateForm, setShowCreateForm }) => {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h1
          className={`${roboto.className} text-3xl font-bold text-primary-800 mb-2`}
        >
          Financial Accounts
        </h1>
        <p className="text-primary-800">
          Manage your financial accounts and view transactions
        </p>
      </div>

      <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3">
        <div id="add-account-button">
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
    </div>
  );
};

export default AccountsHeader;
