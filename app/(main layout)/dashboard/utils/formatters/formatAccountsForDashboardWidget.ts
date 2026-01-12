import { Account } from '@/(main layout)/accounts/types';
import getAccountTypeName from '@/(main layout)/accounts/utils/accountTypeName';
import { formatCurrencyAmount } from '@/utils/formatters';

export default function formatAccountsForDashboardWidget(
  accounts: Account[] | undefined
) {
  if (!accounts) return [];

  return accounts.map((account) => ({
    id: account.id.toString(),
    name: account.name,
    type: getAccountTypeName(account.type),
    balance: formatCurrencyAmount(account.balance),
    currency: account.currency,
    change: 0,
  }));
}
