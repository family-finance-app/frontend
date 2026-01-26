import { Transaction } from '../types';
import { Account } from '@/(main layout)/accounts/types';

// enriches transactions with account and category data
export default function enrichTransactionsWithData(
  transactions: Transaction[],
  accounts: Account[],
  categories: any[],
): any[] {
  return transactions.map((transaction) => {
    const account = accounts.find((acc) => acc.id === transaction.accountId);
    const recipientAccount = transaction.accountRecipientId
      ? accounts.find((acc) => acc.id === transaction.accountRecipientId)
      : undefined;
    const category = categories.find(
      (cat) => cat.id === transaction.categoryId,
    );

    return {
      ...transaction,
      account: account
        ? {
            id: account.id,
            name: account.name,
            type: account.type,
            currency: account.currency,
          }
        : undefined,
      recipientAccount: recipientAccount
        ? {
            id: recipientAccount.id,
            name: recipientAccount.name,
            type: recipientAccount.type,
            currency: recipientAccount.currency,
          }
        : undefined,
      category:
        transaction.categoryId ||
        (category
          ? {
              id: category.id,
              name: category.name,
              type: category.type,
              icon: category.icon,
              color: category.color,
            }
          : undefined),
    };
  });
}
