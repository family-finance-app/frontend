export interface CreateAccountFormData {
  name: string;
  type:
    | 'DEBIT'
    | 'CREDIT'
    | 'CASH'
    | 'BANK'
    | 'INVESTMENT'
    | 'DEPOSIT'
    | 'DIGITAL'
    | 'SAVINGS';
  balance: number;
  currency: 'UAH' | 'USD' | 'EUR';
}

export interface EditAccountFormData {
  name: string;
  type: Account['type'];
  currency: Account['currency'];
}
export interface Account {
  id: number;
  name: string;
  type:
    | 'DEBIT'
    | 'CREDIT'
    | 'CASH'
    | 'BANK'
    | 'INVESTMENT'
    | 'DEPOSIT'
    | 'DIGITAL'
    | 'SAVINGS';
  balance: number;
  currency: 'UAH' | 'USD' | 'EUR';
  description?: string;
  groupId?: number;
  userId: number;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
}

export type AccountType = Account['type'] | 'all';
export const ACCOUNT_TYPES: Account['type'][] = [
  'DEBIT',
  'CREDIT',
  'CASH',
  'BANK',
  'INVESTMENT',
  'DEPOSIT',
  'DIGITAL',
  'SAVINGS',
];

export interface AccountResponse {
  message: string;
  account: Account;
}

export interface AccountsListResponse {
  message: string;
  accounts: Account[];
}

export interface CreateAccountResponse extends AccountResponse {}
export interface UpdateAccountResponse extends AccountResponse {}

export interface DeleteAccountResponse {
  message: string;
  id: number;
}

export const currencyList: Array<{
  value: Account['currency'];
  label: string;
  symbol: string;
}> = [
  { value: 'USD', label: 'USD', symbol: '$' },
  { value: 'EUR', label: 'EUR', symbol: '€' },
  { value: 'UAH', label: 'UAH', symbol: '₴' },
] as const;

export const SELECT_ACCOUNT_TYPES = [
  {
    value: 'CREDIT',
    label: 'Credit Card',
    icon: 'ri-bank-card-2-line',
    description: 'Credit bank card',
  },
  {
    value: 'DEBIT',
    label: 'Debit Card',
    icon: 'ri-bank-card-line',
    description: 'Debit bank card',
  },
  {
    value: 'BANK',
    label: 'Bank Account',
    icon: 'ri-bank-line',
    description: 'Checking or savings account',
  },
  {
    value: 'CASH',
    label: 'Cash',
    icon: 'ri-cash-line',
    description: 'Physical cash on hand',
  },
  {
    value: 'INVESTMENT',
    label: 'Investment',
    icon: 'ri-funds-box-line',
    description: 'Stocks, bonds, or other investments',
  },
  {
    value: 'DEPOSIT',
    label: 'Deposit Account',
    icon: 'ri-discount-percent-line',
    description: 'High-yield savings or term deposit',
  },
  {
    value: 'DIGITAL',
    label: 'Digital Account',
    icon: 'ri-bit-coin-line',
    description: 'PayPal, Bitcoin, or other digital wallets',
  },
  {
    value: 'SAVINGS',
    label: 'Savings',
    icon: 'ri-wallet-3-line',
    description: 'All types of savings for specific goals',
  },
];
