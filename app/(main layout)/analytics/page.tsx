'use client';

import React, { useMemo } from 'react';
import { useMyTransactions } from '@/api/transactions/queries';
import { calculateMonthlyIncomeAndExpenses } from '@/utils/financial';

export default function Analytics() {
  const { data: transactions = [], isLoading } = useMyTransactions();

  const chartData = useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return [];
    }
    return calculateMonthlyIncomeAndExpenses(transactions);
  }, [transactions]);

  return <div className="flex flex-col gap-6"></div>;
}
