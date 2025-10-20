# API Architecture Documentation

## 📁 Структура

```
app/
  lib/
    api-client.ts          # Базовый HTTP client
    query-client.ts        # Конфигурация TanStack Query
  api/
    auth/
      queries.ts           # Query хуки (GET запросы)
      mutations.ts         # Mutation хуки (POST/PUT/DELETE)
    accounts/
      queries.ts
      mutations.ts
    transactions/
      queries.ts
      mutations.ts
  providers.tsx           # React Query Provider
```

## 🎯 Преимущества новой архитектуры

### 1. **Централизация**

- Один `api-client.ts` для всех HTTP запросов
- Единая точка конфигурации в `query-client.ts`
- Переиспользуемые query keys

### 2. **Автоматическое кэширование**

```typescript
// TanStack Query автоматически кэширует данные
const { data, isLoading } = useAccounts();
// Повторные вызовы не делают новых запросов (пока данные не stale)
```

### 3. **Управление состоянием из коробки**

```typescript
const mutation = useCreateAccount();

// Все состояния доступны без useState
mutation.isPending; // loading
mutation.isError; // error occurred
mutation.isSuccess; // success
mutation.error; // error object
mutation.data; // response data
```

### 4. **Автоматическая инвалидация кэша**

```typescript
export const useCreateAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      /* ... */
    },
    onSuccess: () => {
      // Автоматически обновляет список аккаунтов после создания
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts.all });
    },
  });
};
```

### 5. **Оптимизации**

- Дедупликация одинаковых запросов
- Автоматический retry при ошибках
- Background refetch
- Optimistic updates

---

## 📚 Использование

### Queries (GET запросы)

```typescript
'use client';

import { useAccounts, useAccount } from '@/api/accounts/queries';

function AccountsList() {
  // Получить все аккаунты
  const { data: accounts, isLoading, error } = useAccounts();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {accounts?.map((acc) => (
        <li key={acc.account.id}>{acc.account.title}</li>
      ))}
    </ul>
  );
}

function AccountDetail({ id }: { id: number }) {
  // Получить конкретный аккаунт
  const { data: account } = useAccount(id);

  return <div>{account?.account.title}</div>;
}
```

### Mutations (POST/PUT/DELETE)

```typescript
'use client';

import { useCreateAccount } from '@/api/accounts/mutations';
import { CreateAccountFormData } from '@/types/account';

function CreateAccountForm() {
  const createAccount = useCreateAccount();

  const handleSubmit = async (formData: CreateAccountFormData) => {
    try {
      await createAccount.mutateAsync(formData);
      // Успех! Кэш автоматически обновлен
    } catch (error) {
      // Обработка ошибки
      console.error(error);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(formData);
      }}
    >
      {/* form fields */}

      <button type="submit" disabled={createAccount.isPending}>
        {createAccount.isPending ? 'Creating...' : 'Create'}
      </button>

      {createAccount.isError && <div>Error: {createAccount.error.message}</div>}

      {createAccount.isSuccess && <div>Account created!</div>}
    </form>
  );
}
```

---

## 🔑 Query Keys

Query keys определены в `lib/query-client.ts`:

```typescript
// ✅ ХОРОШО: Используй константы
queryClient.invalidateQueries({ queryKey: queryKeys.accounts.all });

// ❌ ПЛОХО: Не используй строки напрямую
queryClient.invalidateQueries({ queryKey: ['accounts'] });
```

---

## 🎨 Паттерны использования

### 1. Зависимые запросы

```typescript
function UserAccounts() {
  // Сначала получаем пользователя
  const { data: user } = useCurrentUser();

  // Затем его аккаунты (запрос не выполнится пока нет userId)
  const { data: accounts } = useAccountsByUser(user?.id ?? 0);

  return /* ... */;
}
```

### 2. Параллельные запросы

```typescript
function Dashboard() {
  // Запросы выполняются параллельно
  const { data: accounts } = useAccounts();
  const { data: transactions } = useTransactions();
  const { data: user } = useCurrentUser();

  return /* ... */;
}
```

### 3. Условный запрос

```typescript
function ConditionalData({ shouldFetch }: { shouldFetch: boolean }) {
  const { data } = useAccounts({
    enabled: shouldFetch, // Запрос выполнится только если true
  });

  return /* ... */;
}
```

### 4. Refetch on interval

```typescript
function LiveBalance() {
  const { data: accounts } = useQuery({
    queryKey: queryKeys.accounts.all,
    queryFn: fetchAccounts,
    refetchInterval: 30000, // Обновлять каждые 30 секунд
  });

  return /* ... */;
}
```

### 5. Optimistic updates

```typescript
export const useUpdateAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAccountAPI,
    onMutate: async (newAccount) => {
      // Отменить текущие запросы
      await queryClient.cancelQueries({ queryKey: queryKeys.accounts.all });

      // Сохранить предыдущие данные
      const previousAccounts = queryClient.getQueryData(queryKeys.accounts.all);

      // Оптимистично обновить UI
      queryClient.setQueryData(queryKeys.accounts.all, (old) => {
        return old?.map((acc) => (acc.id === newAccount.id ? newAccount : acc));
      });

      return { previousAccounts };
    },
    onError: (err, newAccount, context) => {
      // Откатить изменения при ошибке
      queryClient.setQueryData(
        queryKeys.accounts.all,
        context?.previousAccounts
      );
    },
  });
};
```

---

## 🔒 Аутентификация

Token автоматически добавляется к запросам:

```typescript
// В mutations.ts или queries.ts
const token = localStorage.getItem('authToken');

return apiClient.post('/api/accounts', data, {
  token: token || undefined,
});
```

Для лучшего решения можно создать хук `useAuth`:

```typescript
// app/hooks/useAuth.ts
export function useAuth() {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

  return { token, isAuthenticated: !!token };
}

// Использование
const { token } = useAuth();
return apiClient.get('/api/accounts', { token });
```

---

## 🛠 DevTools

В режиме разработки доступны React Query DevTools:

1. Запустите приложение: `npm run dev`
2. В браузере появится плавающая иконка React Query
3. Откройте её чтобы увидеть:
   - Все активные запросы
   - Их статус (fetching, fresh, stale)
   - Кэшированные данные
   - Query keys

---

## 📝 Миграция старого кода

### Было (старый хук):

```typescript
// hooks/useCreateAccount.ts
const [isLoading, setIsLoading] = useState(false);
const [errors, setErrors] = useState({});

const createAccount = async (data) => {
  setIsLoading(true);
  try {
    const response = await accountAPI.createAccount(data);
    return true;
  } catch (error) {
    setErrors(error);
    return false;
  } finally {
    setIsLoading(false);
  }
};
```

### Стало (TanStack Query):

```typescript
// api/accounts/mutations.ts
export const useCreateAccount = () => {
  return useMutation({
    mutationFn: (data) => apiClient.post('/api/accounts', data),
  });
};

// В компоненте
const createAccount = useCreateAccount();
// createAccount.isPending вместо isLoading
// createAccount.error вместо errors
```

---

## 🎯 Лучшие практики

### ✅ DO

1. **Используй TanStack Query для серверных данных**

   ```typescript
   const { data } = useAccounts(); // ✅
   ```

2. **Группируй похожие запросы**

   ```typescript
   // api/accounts/queries.ts - все запросы аккаунтов здесь
   ```

3. **Используй query keys константы**

   ```typescript
   queryKeys.accounts.all; // ✅
   ```

4. **Инвалидируй кэш после мутаций**
   ```typescript
   onSuccess: () => {
     queryClient.invalidateQueries({ queryKey: queryKeys.accounts.all });
   };
   ```

### ❌ DON'T

1. **Не используй useState для серверных данных**

   ```typescript
   const [accounts, setAccounts] = useState([]); // ❌
   ```

2. **Не дублируй логику запросов**

   ```typescript
   // Создай переиспользуемый хук вместо копирования
   ```

3. **Не забывай про enabled**

   ```typescript
   // ❌ Запрос выполнится с id = undefined
   useAccount(id);

   // ✅ Запрос подождёт пока будет id
   useAccount(id, { enabled: !!id });
   ```

---

## 📦 Следующие шаги

1. **Мигрируй существующие хуки** на TanStack Query
2. **Удали старые** `hooks/useCreate*.ts` файлы
3. **Удали старые** `services/*API.ts` классы
4. **Создай недостающие** query/mutation хуки для других endpoints
5. **Добавь обработку ошибок** через React Error Boundaries

---

## 📚 Полезные ссылки

- [TanStack Query Docs](https://tanstack.com/query/latest/docs/react/overview)
- [Query Keys Best Practices](https://tanstack.com/query/latest/docs/react/guides/query-keys)
- [Mutations Guide](https://tanstack.com/query/latest/docs/react/guides/mutations)
