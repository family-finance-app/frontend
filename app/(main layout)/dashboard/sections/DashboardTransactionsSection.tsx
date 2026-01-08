'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button_financial';
import TransactionList from '../../../components/transactions/TransactionList';
import EditTransactionModal from '@/components/transactions/EditTransactionModal';
import { Transaction } from '@/types/transaction';
import { Account } from '@/types/account';
import { useRouter } from 'next/navigation';

interface Category {
  id: number;
  name: string;
  type: string;
  icon?: string;
  color?: string;
}

interface DashboardTransactionsSectionProps {
  transactions: Transaction[];
  accounts: Account[];
  categories: Category[];
  isLoading: boolean;
}

export default function DashboardTransactionsSection({
  transactions,
  accounts,
  categories,
  isLoading,
}: DashboardTransactionsSectionProps) {
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsEditModalOpen(true);
  };

  const handleEditCancel = () => {
    setIsEditModalOpen(false);
  };

  const router = useRouter();

  if (isLoading) {
    return (
      <div className="bg-white  rounded-2xl border border-background-200 p-6">
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
        maxItems={6}
        showAccount={true}
        accounts={accounts}
        categories={categories}
        onEditTransaction={handleEditTransaction}
        actions={
          <Button
            text="View All"
            type="button"
            variant="outline"
            size="sm"
            onClick={() => router.push('/transactions')}
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
