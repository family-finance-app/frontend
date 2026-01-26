import { Account } from '@/(main layout)/accounts/types';

import { accountTypeName } from '@/(main layout)/accounts';

import { formatCurrencyAmount } from '@/utils';

export default function formatAccountsForDashboardWidget(
  accounts: Account[] | undefined
) {
  if (!accounts) return [];

  return accounts.map((account) => ({
    id: account.id.toString(),
    name: account.name,
    type: accountTypeName(account.type),
    balance: formatCurrencyAmount(account.balance),
    currency: account.currency,
    change: 0,
  }));
}
