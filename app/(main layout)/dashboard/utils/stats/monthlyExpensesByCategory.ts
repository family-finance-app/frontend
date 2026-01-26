import { Transaction } from '@/(main layout)/transactions/types';

import { Account } from '@/(main layout)/accounts/types';
import { Category } from '@/(main layout)/transactions/types';

import { ExchangeRateMap } from '@/api/exchangeRate/queries';
import { convertToUAH } from '@/utils';

// calculates expenses per current month by category
export default function calculateMonthExpensesByCategory(
  transactions: Transaction[],
  categories: Category[],
  accounts: Account[] = [],
  rates?: ExchangeRateMap,
) {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const currentMonthTransactions = transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    return (
      transactionDate.getMonth() === currentMonth &&
      transactionDate.getFullYear() === currentYear
    );
  });

  const expensesByCategory = currentMonthTransactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce(
      (acc, transaction) => {
        const category = categories.find(
          (cat) => cat.id === transaction.categoryId,
        );
        const categoryName =
          transaction.categoryName || category?.name || 'Other';
        const existingCategory = acc.find(
          (item) => item.label === categoryName,
        );

        if (existingCategory) {
          const currency = (
            accounts.find((a) => a.id === transaction.accountId)?.currency ||
            transaction.currency ||
            transaction.currency ||
            'UAH'
          ).toString();
          const amountUAH = convertToUAH(
            Number(transaction.amount),
            currency,
            rates,
          );
          existingCategory.value += amountUAH;
        } else {
          const currency = (
            accounts.find((a) => a.id === transaction.accountId)?.currency ||
            transaction.currency ||
            transaction.currency ||
            'UAH'
          ).toString();
          const amountUAH = convertToUAH(
            Number(transaction.amount),
            currency,
            rates,
          );
          acc.push({ label: categoryName, value: amountUAH });
        }

        return acc;
      },
      [] as Array<{ label: string; value: number }>,
    )
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  return expensesByCategory;
}
