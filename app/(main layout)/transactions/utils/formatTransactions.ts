import { Transaction } from '../types';

// converts transaction amount to number, normalizes optional fields
export default function formatTransactionsForList(
  apiTransactions: any[],
): Transaction[] {
  if (!apiTransactions) return [];

  const formatted = apiTransactions.map((transaction) => ({
    id: transaction.id,
    userId: transaction.userId || 0,
    groupId: transaction.groupId,
    accountId: transaction.accountId,
    accountRecipientId:
      transaction.accountRecipientId || transaction.recipientAccount,
    type: transaction.type,
    categoryId: transaction.categoryId || 0,
    amount: Number(transaction.amount) || 0,
    currency: transaction.currency || 'USD',
    date: transaction.date,
    createdAt: transaction.createdAt || new Date().toISOString(),
    updatedAt: transaction.updatedAt || new Date().toISOString(),
    description: transaction.description,
    user: transaction.user,
    account: transaction.account,
    category: transaction.category,
    group: transaction.group,
  }));

  return formatted;
}
