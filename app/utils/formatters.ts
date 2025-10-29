/**
 * ФОРМАТИРОВАНИЕ И УТИЛИТЫ
 *
 * Центральное место для всех функций форматирования.
 * Вместо того чтобы дублировать getCurrencySymbol в каждом компоненте,
 * используем один раз здесь.
 */

import type { Transaction } from '@/types/transaction';

// ============================================================================
// ВАЛЮТА
// ============================================================================

export const currencyFormatters = {
  /**
   * Получить символ валюты
   * @param currency - код валюты (UAH, USD, EUR)
   * @returns символ валюты или сам код если не известен
   */
  symbol: (currency: string): string => {
    const symbols: Record<string, string> = {
      USD: '$',
      EUR: '€',
      UAH: '₴',
    };
    return symbols[currency] || currency;
  },

  /**
   * Отформатировать число в валюту
   * @param amount - сумма
   * @param currency - валюта
   * @returns строка типа "$1,234.56"
   */
  format: (amount: number | string, currency: string): string => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

    if (isNaN(numAmount)) return '0.00';

    const symbol = currencyFormatters.symbol(currency);
    const formatted = numAmount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    return `${symbol}${formatted}`;
  },
};

// ============================================================================
// ТРАНЗАКЦИИ
// ============================================================================

export const transactionFormatters = {
  /**
   * Получить отображение суммы с префиксом
   * @param amount - сумма
   * @param type - тип транзакции
   * @returns строка типа "+100" или "-50" или "→100"
   */
  amountDisplay: (
    amount: number,
    type: 'INCOME' | 'EXPENSE' | 'TRANSFER'
  ): string => {
    const sign = type === 'INCOME' ? '+' : type === 'EXPENSE' ? '-' : '→';
    return `${sign}${amount}`;
  },

  /**
   * Получить CSS класс для цвета суммы
   * @param type - тип транзакции
   * @returns CSS класс
   */
  typeColor: (type: string): string => {
    const colors: Record<string, string> = {
      INCOME: 'text-green-600 dark:text-green-400',
      EXPENSE: 'text-red-600 dark:text-red-400',
      TRANSFER: 'text-gray-600 dark:text-gray-400',
    };
    return colors[type] || 'text-gray-600';
  },

  /**
   * Получить читаемое название типа транзакции
   * @param type - тип
   * @returns название
   */
  typeLabel: (type: string): string => {
    const labels: Record<string, string> = {
      INCOME: 'Income',
      EXPENSE: 'Expense',
      TRANSFER: 'Transfer',
    };
    return labels[type] || type;
  },

  /**
   * Получить иконку для типа транзакции
   * @param type - тип
   * @returns эмодзи
   */
  typeIcon: (type: string): string => {
    const icons: Record<string, string> = {
      INCOME: '📥',
      EXPENSE: '📤',
      TRANSFER: '↔️',
    };
    return icons[type] || '💸';
  },
};

// ============================================================================
// АККАУНТЫ
// ============================================================================

export const accountFormatters = {
  /**
   * Получить иконку для типа аккаунта
   * @param type - тип аккаунта
   * @returns эмодзи
   */
  typeIcon: (type: string): string => {
    const icons: Record<string, string> = {
      BANK: '🏦',
      DEBIT: '💳',
      CREDIT: '💳',
      CASH: '💵',
      INVESTMENT: '📈',
      DEPOSIT: '💰',
    };
    return icons[type] || '🏦';
  },

  /**
   * Получить читаемое название типа аккаунта
   * @param type - тип
   * @returns название
   */
  typeLabel: (type: string): string => {
    const labels: Record<string, string> = {
      BANK: 'Bank Account',
      DEBIT: 'Debit Card',
      CREDIT: 'Credit Card',
      CASH: 'Cash',
      INVESTMENT: 'Investment',
      DEPOSIT: 'Deposit',
    };
    return labels[type] || type;
  },

  /**
   * Отформатировать баланс аккаунта
   * @param balance - баланс
   * @param currency - валюта
   * @returns отформатированная строка
   */
  balanceDisplay: (balance: number | string, currency: string): string => {
    return currencyFormatters.format(balance, currency);
  },
};

// ============================================================================
// ДАТА И ВРЕМЯ
// ============================================================================

export const dateFormatters = {
  /**
   * Преобразовать дату из формата DD.MM.YYYY в Date
   * @param dateString - строка в формате DD.MM.YYYY
   * @returns Date объект
   */
  parseFromDisplay: (dateString: string): Date => {
    const [day, month, year] = dateString.split('.');
    return new Date(`${year}-${month}-${day}`);
  },

  /**
   * Отформатировать Date в DD.MM.YYYY
   * @param date - Date объект
   * @returns строка в формате DD.MM.YYYY
   */
  toDisplay: (date: Date): string => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  },

  /**
   * Получить сегодняшнюю дату в формате DD.MM.YYYY
   * @returns строка в формате DD.MM.YYYY
   */
  today: (): string => {
    return dateFormatters.toDisplay(new Date());
  },

  /**
   * Проверить валидность формата DD.MM.YYYY
   * @param dateString - строка для проверки
   * @returns true если валидна
   */
  isValidFormat: (dateString: string): boolean => {
    const pattern = /^\d{2}\.\d{2}\.\d{4}$/;
    if (!pattern.test(dateString)) return false;

    const [day, month] = dateString.split('.');
    const d = parseInt(day, 10);
    const m = parseInt(month, 10);

    return d >= 1 && d <= 31 && m >= 1 && m <= 12;
  },
};

// ============================================================================
// ЧИСЛА
// ============================================================================

export const numberFormatters = {
  /**
   * Отформатировать число с разделителями
   * @param num - число
   * @param decimals - количество десятичных знаков
   * @returns отформатированная строка
   */
  format: (num: number, decimals = 2): string => {
    return num.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  },

  /**
   * Парсить строку в число
   * @param str - строка
   * @returns число или NaN
   */
  parse: (str: string): number => {
    return parseFloat(str.replace(/,/g, '.'));
  },
};

// ============================================================================
// СТАТИСТИКА
// ============================================================================

export const statsFormatters = {
  /**
   * Рассчитать сумму доходов из массива транзакций
   * @param transactions - транзакции
   * @returns сумма
   */
  totalIncome: (transactions: Transaction[]): number => {
    return transactions
      .filter((tx) => tx.type === 'INCOME')
      .reduce((sum, tx) => sum + tx.amount, 0);
  },

  /**
   * Рассчитать сумму расходов из массива транзакций
   * @param transactions - транзакции
   * @returns сумма
   */
  totalExpense: (transactions: Transaction[]): number => {
    return transactions
      .filter((tx) => tx.type === 'EXPENSE')
      .reduce((sum, tx) => sum + tx.amount, 0);
  },

  /**
   * Рассчитать баланс
   * @param transactions - транзакции
   * @returns баланс
   */
  balance: (transactions: Transaction[]): number => {
    return (
      statsFormatters.totalIncome(transactions) -
      statsFormatters.totalExpense(transactions)
    );
  },
};
