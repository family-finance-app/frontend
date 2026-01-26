import React from 'react';

import { ActionModal, EditModal, DeleteModal } from '@/components';
import { EditAccountFormData } from '../types';

export const ModalsStack: React.FC<{
  accounts: any[];
  actionAccount?: any | null;
  editingAccount?: any | null;
  deletingAccount?: any | null;
  editingAccountId?: number | null;
  actionAccountId?: number | null;
  deletingAccountId?: number | null;
  onCloseAction: () => void;
  onEdit: (acc: any) => void;
  onDeleteConfirm: (id: number) => Promise<void>;
  onCloseEdit: () => void;
  onCloseDelete: () => void;
  onSaveAccount: (data: Partial<EditAccountFormData>) => Promise<void>;
  accountFormFields: any[];
  validateForm: (data: any) => any;
  isLoading?: boolean;
}> = ({
  actionAccount,
  editingAccount,
  deletingAccount,
  editingAccountId,
  actionAccountId,
  deletingAccountId,
  onCloseAction,
  onEdit,
  onDeleteConfirm,
  onCloseEdit,
  onCloseDelete,
  onSaveAccount,
  accountFormFields,
  validateForm,
  isLoading,
}) => {
  return (
    <>
      {actionAccount && (
        <ActionModal
          modalTitle="Account Actions"
          data={
            <>
              <div className="flex items-baseline-last">
                <h3 className="text-lg font-semibold text-primary-700 mb-2 mr-1.5">
                  {actionAccount.name}
                </h3>
                <p className="text-background-600 dark:text-background-700">
                  {actionAccount.type}
                </p>
              </div>

              <div className="space-y-1 text-sm">
                <p className="text-background-600 dark:text-background-700">
                  <span className="font-medium">Balance:</span>{' '}
                  {actionAccount.balance}
                </p>
                <p className="text-background-600 dark:text-background-700">
                  <span className="font-medium">Currency:</span>{' '}
                  {actionAccount.currency}
                </p>
              </div>
            </>
          }
          actionButtons={[
            {
              text: 'Edit Account',
              type: 'button',
              variant: 'primary',
              action: () => onEdit(actionAccount),
            },
            {
              text: 'Delete Account',
              type: 'button',
              variant: 'danger',
              action: () => onDeleteConfirm(actionAccount.id),
            },
          ]}
          onClose={onCloseAction}
          isOpen={!!actionAccountId}
        />
      )}

      {editingAccount && (
        <EditModal<EditAccountFormData>
          isOpen={!!editingAccountId}
          onClose={onCloseEdit}
          onSubmit={onSaveAccount}
          title="Edit Account"
          fields={accountFormFields}
          initialData={{
            name: editingAccount.name,
            type: editingAccount.type,
            currency: editingAccount.currency,
          }}
          validateForm={validateForm}
          isLoading={isLoading}
        />
      )}

      <DeleteModal
        isOpen={!!deletingAccountId}
        title="Delete Account"
        itemName={deletingAccount?.name || null}
        isLoading={isLoading}
        warningMessage={`All transaction history for ${deletingAccount?.name} will be permanently deleted from your account.`}
        additionalInfo="Make sure you have backed up any important information before proceeding."
        onClose={onCloseDelete}
        onConfirm={() =>
          deletingAccountId && onDeleteConfirm(deletingAccountId)
        }
      />
    </>
  );
};

export default ModalsStack;
