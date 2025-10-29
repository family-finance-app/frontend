import { useState } from 'react';
import { Transaction } from '@/types/transaction';

export interface TransactionEditState {
  transaction: Transaction | null;
  isOpen: boolean;
}

export function useTransactionEdit() {
  const [editState, setEditState] = useState<TransactionEditState>({
    transaction: null,
    isOpen: false,
  });

  const openEdit = (transaction: Transaction) => {
    setEditState({
      transaction,
      isOpen: true,
    });
  };

  const closeEdit = () => {
    setEditState({
      transaction: null,
      isOpen: false,
    });
  };

  const resetEdit = () => {
    setEditState({
      transaction: null,
      isOpen: false,
    });
  };

  return {
    editState,
    openEdit,
    closeEdit,
    resetEdit,
  };
}
