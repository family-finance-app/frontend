# 🚀 Quick Start: New API Architecture

## Что изменилось?

Теперь вместо:

- ❌ Кастомных хуков с useState для каждого запроса
- ❌ Классов API в папке services

Используем:

- ✅ **TanStack Query** (React Query) - индустриальный стандарт
- ✅ Централизованный API client
- ✅ Автоматическое кэширование и управление состоянием

## Как использовать?

### 1. Для GET запросов (queries)

```typescript
import { useAccounts } from '@/api/accounts/queries';

function MyComponent() {
  const { data, isLoading, error } = useAccounts();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>{/* Используй data */}</div>;
}
```

### 2. Для POST/PUT/DELETE (mutations)

```typescript
import { useCreateAccount } from '@/api/accounts/mutations';

function MyForm() {
  const createAccount = useCreateAccount();

  const handleSubmit = async (formData) => {
    try {
      await createAccount.mutateAsync(formData);
      // Успех! Данные автоматически обновятся
    } catch (error) {
      // Обработка ошибки
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <button disabled={createAccount.isPending}>
        {createAccount.isPending ? 'Creating...' : 'Create'}
      </button>

      {createAccount.isError && <div>Error!</div>}
      {createAccount.isSuccess && <div>Success!</div>}
    </form>
  );
}
```

## Доступные хуки

### Authentication

```typescript
import { useSignIn, useSignUp, useSignOut } from '@/api/auth/mutations';
import { useCurrentUser } from '@/api/auth/queries';
```

### Accounts

```typescript
import {
  useCreateAccount,
  useUpdateAccount,
  useDeleteAccount,
} from '@/api/accounts/mutations';

import {
  useAccounts,
  useAccount,
  useAccountsByUser,
} from '@/api/accounts/queries';
```

### Transactions

```typescript
import {
  useCreateTransaction,
  useUpdateTransaction,
  useDeleteTransaction,
} from '@/api/transactions/mutations';

import {
  useTransactions,
  useTransaction,
  useMyTransactions,
  useFamilyTransactions,
} from '@/api/transactions/queries';
```

## Примеры использования

Смотри:

- `app/components/examples/AccountFormExample.tsx` - форма создания аккаунта
- `app/components/examples/SignInFormExample.tsx` - форма входа
- `app/components/examples/DashboardExample.tsx` - dashboard с несколькими запросами

## Полная документация

Читай `API_ARCHITECTURE.md` для:

- Детального объяснения архитектуры
- Продвинутых паттернов использования
- Лучших практик
- Инструкций по миграции старого кода

## Dev Tools

В режиме разработки открой React Query DevTools (плавающая кнопка справа внизу) чтобы увидеть:

- Все запросы
- Их статус
- Кэшированные данные
