# Exchange Rate System

This document describes the exchange rate system that handles multi-currency support via the backend API.

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [API Integration](#api-integration)
4. [Data Flow](#data-flow)
5. [Usage Examples](#usage-examples)
6. [Currency Conversion](#currency-conversion)
7. [Troubleshooting](#troubleshooting)

---

## Overview

The exchange rate system provides:

- Exchange rates fetched from the backend API (`/currency` endpoint)
- Backend handles external rate sources and caching internally
- Support for UAH, USD, and EUR currencies
- Authentication required (uses auth token)

### Supported Currencies

| Currency          | Code | Description              |
| ----------------- | ---- | ------------------------ |
| Ukrainian Hryvnia | UAH  | Base currency (rate = 1) |
| US Dollar         | USD  | Converted via backend    |
| Euro              | EUR  | Converted via backend    |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Component Layer                           │
│  Dashboard │ BalanceWidget │ ExchangeRatesWidget            │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    Hooks Layer                               │
│  useExchangeRates() │ useTotalBalanceInUAH()                │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    API Layer                                 │
│  queries.ts (React Query) → apiClient                       │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend API                               │
│  GET /currency → Returns rates with fetchedAt timestamp     │
│  (Backend handles external sources & caching internally)    │
└─────────────────────────────────────────────────────────────┘
```

---

## API Integration

### File Location

```
app/api/exchangeRate/
└── queries.ts      # React Query hook for exchange rates

app/utils/
└── currency-converter.ts  # Conversion utilities

app/hooks/
└── useTotalBalanceInUAH.ts  # Balance calculation hook
```

### queries.ts

**Purpose:** React Query hook for fetching exchange rates from backend

**Types:**

```typescript
// Rate map type
export interface ExchangeRateMap {
  [code: string]: number;
}

// Backend response structure
export interface ExchangeRatesResponse {
  rates: ExchangeRateMap;
  fetchedAt: string; // ISO timestamp of when rates were fetched
}
```

**Hook Export:**

```typescript
export function useExchangeRates(): {
  exchangeRates: ExchangeRateMap | undefined;
  lastUpdated: string | undefined;
  isLoading: boolean;
  isPending: boolean;
  isError: boolean;
  error: ApiError | null;
};
```

**Implementation:**

```typescript
export const useExchangeRates = () => {
  const { token } = useAuth();

  const query = useQuery<ApiSuccess<ExchangeRatesResponse>, ApiError>({
    queryKey: queryKeys.exchangeRate.all,
    queryFn: async () => {
      const response =
        await apiClient.get<ApiSuccess<ExchangeRatesResponse>>('/currency');
      return response;
    },
    enabled: !!token, // Only fetch when authenticated
  });

  return {
    exchangeRates: query.data?.data.rates,
    lastUpdated: query.data?.data.fetchedAt,
    ...query,
  };
};
```

### currency-converter.ts

**Purpose:** Currency conversion utilities

**Exports:**

```typescript
// Convert single amount to UAH
export function convertToUAH(
  amount: number,
  fromCurrency: string,
  rates: ExchangeRateMap,
): number;

// Calculate total balance of all accounts in UAH
export function calculateTotalBalanceInUAH(
  accounts: Account[],
  rates: ExchangeRateMap,
): number;
```

---

## Data Flow

### Fetching Rates

```
Component mounts
       │
       ▼
useExchangeRates() called
       │
       ▼
Check authentication (token exists?)
       │
       ├─► No token: Query disabled, no fetch
       │
       └─► Token exists: Execute query
           │
           ▼
       apiClient.get('/currency')
           │
           ▼
       Backend returns { rates, fetchedAt }
           │
           ▼
       React Query caches response
           │
           ▼
       Components receive rates
```

### React Query Caching

- Query key: `queryKeys.exchangeRate.all`
- Caching handled by React Query (default stale time)
- Backend handles external API caching internally
- Refetches on window focus (React Query default)

---

## Usage Examples

### Get Exchange Rates

```tsx
import { useExchangeRates } from '@/app/api/exchangeRate/queries';

function ExchangeDisplay() {
  const { exchangeRates, isLoading, lastUpdated } = useExchangeRates();

  if (isLoading) return <Spinner />;

  return (
    <div>
      <p>USD: {exchangeRates?.USD?.toFixed(2)} UAH</p>
      <p>EUR: {exchangeRates?.EUR?.toFixed(2)} UAH</p>
      {lastUpdated && <p>Updated: {new Date(lastUpdated).toLocaleString()}</p>}
    </div>
  );
}
```

### Convert Currency

```tsx
import { convertToUAH } from '@/utils/currency-converter';
import { useExchangeRates } from '@/app/api/exchangeRate/queries';

function AmountDisplay({ amount, currency }) {
  const { exchangeRates } = useExchangeRates();

  if (!exchangeRates) return null;

  const uahAmount = convertToUAH(amount, currency, exchangeRates);

  return <span>{uahAmount.toFixed(2)} ₴</span>;
}
```

### Calculate Total Balance

```tsx
import { useTotalBalanceInUAH } from '@/hooks/useTotalBalanceInUAH';

function BalanceWidget({ accounts }) {
  const { totalBalance, isLoading } = useTotalBalanceInUAH(accounts);

  if (isLoading) return <Skeleton />;

  return (
    <div>
      <h2>Total Balance</h2>
      <p>{totalBalance.toLocaleString()} ₴</p>
    </div>
  );
}
```

### Check Loading and Error States

```tsx
function RatesWidget() {
  const { exchangeRates, isLoading, isError, error } = useExchangeRates();

  if (isLoading) {
    return <Skeleton className="h-20 w-full" />;
  }

  if (isError) {
    return <ErrorMessage message={error?.message || 'Failed to load rates'} />;
  }

  if (!exchangeRates) {
    return <p>No rates available</p>;
  }

  return (
    <div>
      {Object.entries(exchangeRates).map(([code, rate]) => (
        <p key={code}>
          {code}: {rate.toFixed(2)} UAH
        </p>
      ))}
    </div>
  );
}
```

---

## Currency Conversion

### Conversion Formula

```
UAH Amount = Original Amount × Exchange Rate
```

### Examples

| Original | Currency | Rate  | UAH Equivalent |
| -------- | -------- | ----- | -------------- |
| 100      | USD      | 41.25 | 4,125 ₴        |
| 50       | EUR      | 45.10 | 2,255 ₴        |
| 1000     | UAH      | 1.00  | 1,000 ₴        |

### Multi-Account Balance

```typescript
function calculateTotalBalanceInUAH(accounts, rates) {
  return accounts.reduce((total, account) => {
    const uahAmount = convertToUAH(account.balance, account.currency, rates);
    return total + uahAmount;
  }, 0);
}
```

---

## Backend API Reference

### Endpoint

```
GET /currency
```

### Headers

```
Authorization: Bearer <token>
```

### Response

```typescript
interface ApiSuccess<ExchangeRatesResponse> {
  data: {
    rates: {
      UAH: number; // Always 1
      USD: number; // e.g., 41.25
      EUR: number; // e.g., 50.10
    };
    fetchedAt: string; // ISO timestamp, e.g., "2026-02-02T08:00:00.000Z"
  };
}
```

### Example Response

```json
{
  "data": {
    "rates": {
      "UAH": 1,
      "USD": 41.25,
      "EUR": 45.1
    },
    "fetchedAt": "2026-02-02T08:00:00.000Z"
  }
}
```

---

## Troubleshooting

### Issue: Rates not loading

**Cause:** User not authenticated or token expired.

**Solution:**

1. Verify user is logged in
2. Check that `useAuth()` returns a valid token
3. Ensure the query is enabled (`enabled: !!token`)

### Issue: 401 Unauthorized error

**Cause:** Invalid or expired authentication token.

**Solution:**

1. Re-authenticate the user
2. Check token refresh logic in AuthContext

### Issue: Rates showing undefined

**Cause:** Query still loading or failed.

**Solution:**

```tsx
const { exchangeRates, isLoading, isError } = useExchangeRates();

if (isLoading) return <Loading />;
if (isError || !exchangeRates) return <Error />;
```

### Issue: Stale rates displayed

**Cause:** React Query serving cached data.

**Solution:**

```typescript
// Invalidate and refetch
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-client';

const queryClient = useQueryClient();
queryClient.invalidateQueries({ queryKey: queryKeys.exchangeRate.all });
```

### Issue: Rates flickering on page load

**Cause:** Initial render before data loads.

**Solution:** Use loading state:

```tsx
if (isLoading) return <Skeleton />;
```
