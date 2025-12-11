// returns a symbol based on the currency code
export const formatCurrencySymbol = (currency: string): string => {
  const symbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    UAH: '₴',
  };
  return symbols[currency] || currency;
};

// returns amount in 10 000.00 format
export const formatCurrencyAmount = (amount: number | string): string => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

  if (isNaN(numAmount)) return '0.00';

  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
    .format(numAmount)
    .replace(/,/g, ' ');

  return formatted;
};

export const transactionFormatters = {
  // adds a sign to transaction amount (+/-) according to the type (income/expense/transfer)
  amountDisplay: (
    amount: number,
    type: 'INCOME' | 'EXPENSE' | 'TRANSFER'
  ): string => {
    const sign = type === 'INCOME' ? '+' : type === 'EXPENSE' ? '-' : '→';
    return `${sign}${amount}`;
  },

  // sets color matching (app palette) for transaction amount according to the type
  typeColor: (type: string): string => {
    const colors: Record<string, string> = {
      INCOME: 'text-success-700',
      EXPENSE: 'text-danger-600',
      TRANSFER: 'text-kashmir-500',
    };
    return colors[type] || 'text-gray-600';
  },

  typeLabel: (type: string): string => {
    const labels: Record<string, string> = {
      INCOME: 'Income',
      EXPENSE: 'Expense',
      TRANSFER: 'Transfer',
    };
    return labels[type] || type;
  },
};

export const accountFormatters = {
  typeIcon: (type: string): string => {
    const icons: Record<string, string> = {
      BANK: '🏦',
      DEBIT: '💳',
      CREDIT: '💳',
      CASH: '💵',
      INVESTMENT: '📈',
      DEPOSIT: '💰',
      DIGITAL: '📱',
      SAVINGS: '💰',
    };
    return icons[type] || '🏦';
  },

  typeLabel: (type: string): string => {
    const labels: Record<string, string> = {
      BANK: 'Bank Account',
      DEBIT: 'Debit Card',
      CREDIT: 'Credit Card',
      CASH: 'Cash',
      INVESTMENT: 'Investment',
      DEPOSIT: 'Deposit',
      DIGITAL: 'Digital',
      SAVINGS: 'Savings',
    };
    return labels[type] || type;
  },
};

export const dateFormatters = {
  // from DD.MM.YYYY to Date object
  parseFromDisplay: (dateString: string): Date => {
    const [day, month, year] = dateString.split('.');
    return new Date(`${year}-${month}-${day}`);
  },

  // from Date object to DD.MM.YYYY
  toDisplay: (date: string): string => {
    const dateObject = new Date(date);
    const day = String(dateObject.getDate()).padStart(2, '0');
    const month = String(dateObject.getMonth() + 1).padStart(2, '0');
    const year = dateObject.getFullYear();
    return `${day}.${month}.${year}`;
  },

  // returns Today in string DD.MM.YYYY
  today: (): string => {
    return dateFormatters.toDisplay(new Date().toISOString());
  },

  isValidFormat: (dateString: string): boolean => {
    const pattern = /^\d{2}\.\d{2}\.\d{4}$/;
    if (!pattern.test(dateString)) return false;

    const [day, month] = dateString.split('.');
    const d = parseInt(day, 10);
    const m = parseInt(month, 10);

    return d >= 1 && d <= 31 && m >= 1 && m <= 12;
  },
};
