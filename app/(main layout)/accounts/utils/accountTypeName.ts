import { Account } from '../types';

// account type display name
export default function getAccountTypeName(type: Account['type']): string {
  const names: Record<Account['type'], string> = {
    DEBIT: 'Debit Card',
    CREDIT: 'Credit Card',
    CASH: 'Cash',
    BANK: 'Bank Account',
    INVESTMENT: 'Investment',
    DEPOSIT: 'Deposit',
    DIGITAL: 'Digital Wallet',
    SAVINGS: 'Savings',
  };
  return names[type] || type;
}
