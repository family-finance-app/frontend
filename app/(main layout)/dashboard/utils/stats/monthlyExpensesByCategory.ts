import { Transaction } from '@/(main layout)/transactions/types';

// calculates expenses per current month by category
export default function calculateMonthExpensesByCategory(
  transactions: Transaction[],
  categories: any[]
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
    .reduce((acc, transaction) => {
      const category = categories.find(
        (cat) => cat.id === transaction.categoryId
      );
      const categoryName =
        transaction.category?.name || category?.name || 'Other';
      const existingCategory = acc.find((item) => item.label === categoryName);

      if (existingCategory) {
        existingCategory.value += transaction.amount;
      } else {
        acc.push({ label: categoryName, value: transaction.amount });
      }

      return acc;
    }, [] as Array<{ label: string; value: number }>)
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  return expensesByCategory;
}
