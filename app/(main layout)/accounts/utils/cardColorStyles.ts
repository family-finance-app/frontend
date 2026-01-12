import { Account } from '../types';

export default function getCardColorStyles(accountType: Account['type']) {
  const colorMap: Record<Account['type'], { accent: string }> = {
    BANK: {
      accent: 'text-background-500',
    },
    DEBIT: {
      accent: 'text-primary-600',
    },
    CREDIT: {
      accent: 'text-danger-500',
    },
    CASH: {
      accent: 'text-warning-600',
    },
    INVESTMENT: {
      accent: 'text-smalt-400',
    },
    DEPOSIT: {
      accent: 'text-hazel-400',
    },
    DIGITAL: {
      accent: 'text-kashmir-500',
    },
    SAVINGS: {
      accent: 'text-success-600',
    },
  };

  return colorMap[accountType] || colorMap.BANK;
}
