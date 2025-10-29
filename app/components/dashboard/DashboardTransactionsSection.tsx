'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button_financial';
import TransactionList from '@/components/ui/TransactionList';
import EditTransactionModal from '@/components/ui/EditTransactionModal';
import { Transaction } from '@/types/transaction';

interface DashboardTransactionsSectionProps {
  transactions: Transaction[];
  isLoading: boolean;
}

export function DashboardTransactionsSection({
  transactions,
  isLoading,
}: DashboardTransactionsSectionProps) {
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsEditModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-background-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-background-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-background-200 rounded-lg"></div>
                <div className="flex-1">
                  <div className="h-4 bg-background-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-background-200 rounded w-1/2"></div>
                </div>
                <div className="h-4 bg-background-200 rounded w-20"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <TransactionList
        transactions={transactions}
        title="Recent Transactions"
        maxItems={5}
        showAccount={true}
        onEditTransaction={handleEditTransaction}
        actions={
          <Button
            text="View All"
            type="button"
            variant="outline"
            size="sm"
            onClick={() => console.log('View all transactions')}
          />
        }
      />

      <EditTransactionModal
        transaction={editingTransaction}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingTransaction(null);
        }}
      />
    </>
  );
}
