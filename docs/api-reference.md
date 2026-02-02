# API Reference

This document provides a comprehensive reference for all API endpoints and React Query hooks used in the Family Finance application.

## Table of Contents

1. [API Client](#api-client)
2. [Authentication](#authentication)
3. [Accounts](#accounts)
4. [Transactions](#transactions)
5. [Categories](#categories)
6. [Exchange Rates](#exchange-rates)
7. [Profile](#profile)
8. [Security](#security)

---

## API Client

**Location:** `/app/lib/api-client.ts`

### Overview

The `APIClient` class provides a centralized HTTP client for all backend communication.

### Features

- Automatic JWT token attachment to requests
- Token refresh on 401 Unauthorized responses
- Support for internal API and external APIs (e.g., NBU)
- Consistent error handling

### Methods

```typescript
class APIClient {
  get<T>(endpoint: string, config?: RequestConfig): Promise<T>;
  post<T>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<T>;
  put<T>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<T>;
  patch<T>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig,
  ): Promise<T>;
  delete<T>(endpoint: string, config?: RequestConfig): Promise<T>;
  externalGet<T>(absoluteUrl: string, config?: RequestConfig): Promise<T>;
}
```

### Usage

```typescript
import { apiClient } from '@/lib/api-client';

// Internal API call
const accounts = await apiClient.get<Account[]>('/accounts');

// External API call (no base URL prefix)
const rates = await apiClient.externalGet<CurrencyRate[]>(
  'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json',
);
```

---

## Authentication

**Location:** `/app/api/auth/`

### Endpoints

| Method | Endpoint        | Description          |
| ------ | --------------- | -------------------- |
| POST   | `/auth/signup`  | Register new user    |
| POST   | `/auth/signin`  | Login user           |
| POST   | `/auth/refresh` | Refresh access token |
| POST   | `/auth/signout` | Logout user          |
| GET    | `/auth/me`      | Get current user     |

### Hooks

#### `useCurrentUser()`

Fetches the currently authenticated user.

```typescript
const { user, isLoading, isError, error } = useCurrentUser();
```

**Returns:**

- `user: User | null` - Current user data
- `isLoading: boolean` - Loading state
- `isError: boolean` - Error state
- `error: Error | null` - Error object

#### `useSignIn()`

Mutation hook for user login.

```typescript
const signIn = useSignIn();

await signIn.mutateAsync({
  email: 'user@example.com',
  password: 'password123',
});
```

#### `useSignUp()`

Mutation hook for user registration.

```typescript
const signUp = useSignUp();

await signUp.mutateAsync({
  email: 'user@example.com',
  password: 'password123',
  terms: true,
});
```

#### `useSignOut()`

Mutation hook for user logout.

```typescript
const signOut = useSignOut();

await signOut.mutateAsync();
```

### Types

```typescript
interface User {
  id: number;
  email: string;
  name?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

interface SignInPayload {
  email: string;
  password: string;
}

interface SignUpPayload {
  email: string;
  password: string;
  terms: boolean;
}
```

---

## Accounts

**Location:** `/app/api/accounts/`

### Endpoints

| Method | Endpoint        | Description           |
| ------ | --------------- | --------------------- |
| GET    | `/accounts`     | Get all user accounts |
| POST   | `/accounts`     | Create new account    |
| PUT    | `/accounts/:id` | Update account        |
| DELETE | `/accounts/:id` | Delete account        |

### Hooks

#### `useMyAccounts()`

Fetches all accounts for the current user.

```typescript
const { accounts, isLoading, isError } = useMyAccounts();
```

**Returns:**

- `accounts: Account[]` - Array of user accounts

#### `useCreateAccount()`

Mutation hook for creating a new account.

```typescript
const createAccount = useCreateAccount();

await createAccount.mutateAsync({
  name: 'Savings Account',
  type: 'savings',
  currency: 'UAH',
  balance: 10000,
  group: 'personal',
});
```

#### `useUpdateAccount()`

Mutation hook for updating an existing account.

```typescript
const updateAccount = useUpdateAccount();

await updateAccount.mutateAsync({
  id: 1,
  name: 'Updated Name',
  balance: 15000,
});
```

#### `useDeleteAccount()`

Mutation hook for deleting an account.

```typescript
const deleteAccount = useDeleteAccount();

await deleteAccount.mutateAsync(accountId);
```

### Types

```typescript
interface Account {
  id: number;
  name: string;
  type: AccountType;
  currency: 'UAH' | 'USD' | 'EUR';
  balance: number;
  group: 'personal' | 'family';
  userId: number;
  createdAt: string;
  updatedAt: string;
}

type AccountType = 'bank' | 'cash' | 'credit' | 'savings' | 'investment';

interface CreateAccountPayload {
  name: string;
  type: AccountType;
  currency: 'UAH' | 'USD' | 'EUR';
  balance: number;
  group: 'personal' | 'family';
}
```

---

## Transactions

**Location:** `/app/api/transactions/`

### Endpoints

| Method | Endpoint            | Description               |
| ------ | ------------------- | ------------------------- |
| GET    | `/transactions`     | Get all user transactions |
| POST   | `/transactions`     | Create new transaction    |
| PUT    | `/transactions/:id` | Update transaction        |
| DELETE | `/transactions/:id` | Delete transaction        |

### Hooks

#### `useTransactions()` / `useMyTransactions()`

Fetches all transactions for the current user.

```typescript
const { transactions, isLoading, isError } = useTransactions();
```

**Returns:**

- `transactions: Transaction[]` - Array of user transactions

#### `useCreateTransaction()`

Mutation hook for creating a new transaction.

```typescript
const createTransaction = useCreateTransaction();

await createTransaction.mutateAsync({
  type: 'EXPENSE',
  amount: 500,
  categoryId: 1,
  accountId: 1,
  description: 'Grocery shopping',
  date: '2026-02-01',
});
```

#### `useUpdateTransaction()`

Mutation hook for updating an existing transaction.

```typescript
const updateTransaction = useUpdateTransaction();

await updateTransaction.mutateAsync({
  id: 1,
  amount: 550,
  description: 'Updated description',
});
```

#### `useDeleteTransaction()`

Mutation hook for deleting a transaction.

```typescript
const deleteTransaction = useDeleteTransaction();

await deleteTransaction.mutateAsync(transactionId);
```

### Types

```typescript
interface Transaction {
  id: number;
  type: TransactionType;
  amount: number;
  categoryId: number;
  accountId: number;
  description?: string;
  date: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

type TransactionType = 'INCOME' | 'EXPENSE' | 'TRANSFER';

interface CreateTransactionPayload {
  type: TransactionType;
  amount: number;
  categoryId: number;
  accountId: number;
  description?: string;
  date: string;
}
```

---

## Categories

**Location:** `/app/api/categories/`

### Endpoints

| Method | Endpoint      | Description                    |
| ------ | ------------- | ------------------------------ |
| GET    | `/categories` | Get all transaction categories |

### Hooks

#### `useCategories()`

Fetches all available transaction categories.

```typescript
const { categories, isLoading, isError } = useCategories();
```

**Returns:**

- `categories: Category[]` - Array of categories

### Types

```typescript
interface Category {
  id: number;
  name: string;
  type: 'INCOME' | 'EXPENSE';
  icon?: string;
  color?: string;
}
```

---

## Exchange Rates

**Location:** `/app/api/exchangeRate/`

### External API

**Source:** National Bank of Ukraine (NBU)
**Endpoint:** `https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json`

### Hooks

#### `useExchangeRates()`

Fetches current exchange rates with automatic scheduling.

```typescript
const { exchangeRates, isLoading, lastUpdated } = useExchangeRates();
```

**Returns:**

- `exchangeRates: ExchangeRate` - Object with currency rates `{ UAH: 1, USD: 40.5, EUR: 44.2 }`
- `lastUpdated: Date` - Last update timestamp

### Caching Strategy

- Rates are cached in localStorage
- Cache expires at midnight UTC
- Automatic refetch at 8:00 AM and 3:00 PM (Kyiv time)

### Types

```typescript
interface ExchangeRate {
  UAH: number; // Always 1 (base currency)
  USD: number; // USD to UAH rate
  EUR: number; // EUR to UAH rate
}

// Default fallback rates when API unavailable
const DEFAULT_RATES: ExchangeRate = {
  UAH: 1,
  USD: 40.5,
  EUR: 44.5,
};
```

---

## Profile

**Location:** `/app/api/profile/`

### Endpoints

| Method | Endpoint          | Description            |
| ------ | ----------------- | ---------------------- |
| PUT    | `/profile`        | Update user profile    |
| PUT    | `/profile/avatar` | Update profile picture |

### Hooks

#### `useUpdateProfile()`

Mutation hook for updating user profile.

```typescript
const updateProfile = useUpdateProfile();

await updateProfile.mutateAsync({
  name: 'John Doe',
  email: 'john@example.com',
});
```

### Types

```typescript
interface UpdateProfilePayload {
  name?: string;
  email?: string;
}
```

---

## Security

**Location:** `/app/api/security/`

### Endpoints

| Method | Endpoint         | Description     |
| ------ | ---------------- | --------------- |
| PUT    | `/auth/password` | Change password |
| PUT    | `/auth/email`    | Change email    |

### Hooks

#### `useChangePassword()`

Mutation hook for changing user password.

```typescript
const changePassword = useChangePassword();

await changePassword.mutateAsync({
  currentPassword: 'oldPassword123',
  newPassword: 'newPassword456',
});
```

#### `useChangeEmail()`

Mutation hook for changing user email.

```typescript
const changeEmail = useChangeEmail();

await changeEmail.mutateAsync({
  password: 'currentPassword',
  newEmail: 'newemail@example.com',
});
```

### Types

```typescript
interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

interface ChangeEmailPayload {
  password: string;
  newEmail: string;
}
```

---

## Query Keys

All queries are organized with consistent keys for cache management:

```typescript
export const queryKeys = {
  auth: {
    currentUser: ['auth', 'currentUser'],
  },
  accounts: {
    all: ['accounts'],
    byId: (id: number) => ['accounts', id],
  },
  transactions: {
    all: ['transactions'],
    byId: (id: number) => ['transactions', id],
  },
  categories: {
    all: ['categories'],
  },
  exchangeRate: {
    all: ['exchange-rates'],
  },
  profile: {
    all: ['profile'],
  },
};
```

## Error Handling

All API errors follow a consistent structure:

```typescript
interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}
```

### Common Error Codes

| Code | Description                                |
| ---- | ------------------------------------------ |
| 400  | Bad Request - Invalid input                |
| 401  | Unauthorized - Invalid/expired token       |
| 403  | Forbidden - Insufficient permissions       |
| 404  | Not Found - Resource doesn't exist         |
| 422  | Validation Error - Input validation failed |
| 500  | Internal Server Error                      |

---

## Response Format

All successful API responses follow this structure:

```typescript
interface ApiSuccess<T> {
  data: T;
  message?: string;
}
```
