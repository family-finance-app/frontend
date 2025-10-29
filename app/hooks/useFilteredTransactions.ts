/**
 * ХУК ДЛЯ ФИЛЬТРАЦИИ ТРАНЗАКЦИЙ
 *
 * Вынесли логику фильтрации в отдельный хук.
 * Используется на нескольких страницах, поэтому централизовано.
 */

import { useMemo } from 'react';
import type { Transaction } from '@/types/transaction';

export type FilterType = 'all' | 'INCOME' | 'EXPENSE' | 'TRANSFER';
export type TimeRange = 'week' | 'month' | 'quarter' | 'year' | 'all';

interface UseFilteredTransactionsOptions {
  type?: FilterType;
  timeRange?: TimeRange;
}

/**
 * Хук для фильтрации транзакций
 * @param transactions - массив транзакций для фильтрации
 * @param options - опции фильтрации
 * @returns отфильтрованный массив транзакций
 */
export const useFilteredTransactions = (
  transactions: Transaction[] | undefined,
  options: UseFilteredTransactionsOptions = {}
): Transaction[] => {
  return useMemo(() => {
    if (!transactions) return [];

    const { type = 'all', timeRange = 'all' } = options;

    return transactions.filter((transaction) => {
      // Фильтр по типу транзакции
      if (type !== 'all' && transaction.type !== type) {
        return false;
      }

      // Фильтр по времени
      if (timeRange !== 'all') {
        const transactionDate = new Date(transaction.date);
        const now = new Date();
        const startDate = new Date();

        switch (timeRange) {
          case 'week':
            startDate.setDate(now.getDate() - 7);
            break;
          case 'month':
            startDate.setMonth(now.getMonth() - 1);
            break;
          case 'quarter':
            startDate.setMonth(now.getMonth() - 3);
            break;
          case 'year':
            startDate.setFullYear(now.getFullYear() - 1);
            break;
        }

        if (transactionDate < startDate || transactionDate > now) {
          return false;
        }
      }

      return true;
    });
  }, [transactions, options.type, options.timeRange]);
};

/**
 * Вспомогательная функция для фильтрации по категориям
 * @param transactions - массив транзакций
 * @param categoryId - ID категории
 * @returns отфильтрованный массив
 */
export const useFilteredTransactionsByCategory = (
  transactions: Transaction[] | undefined,
  categoryId: number
): Transaction[] => {
  return useMemo(() => {
    if (!transactions) return [];
    return transactions.filter((tx) => tx.categoryId === categoryId);
  }, [transactions, categoryId]);
};

/**
 * Вспомогательная функция для фильтрации по аккаунту
 * @param transactions - массив транзакций
 * @param accountId - ID аккаунта
 * @returns отфильтрованный массив
 */
export const useFilteredTransactionsByAccount = (
  transactions: Transaction[] | undefined,
  accountId: number
): Transaction[] => {
  return useMemo(() => {
    if (!transactions) return [];
    return transactions.filter((tx) => tx.accountId === accountId);
  }, [transactions, accountId]);
};
