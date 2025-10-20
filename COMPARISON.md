# ⚖️ Сравнение: Старый vs Новый подход

## Пример 1: Создание аккаунта

### ❌ СТАРЫЙ ПОДХОД (Кастомный хук)

**hooks/useCreateAccount.ts** (61 строка)

```typescript
import { useState } from 'react';
import { accountAPI } from '@/services/accountAPI';

export const useCreateAccount = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState<string>('');

  const createAccount = async (formData: CreateAccountFormData) => {
    const validationErrors = validateCreateAccountForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return false;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await accountAPI.createAccount(formData);
      setSuccessMessage(`New ${formData.type} account created`);
      setTimeout(() => setSuccessMessage(''), 3000);
      return true;
    } catch (error: any) {
      if (error.error === 'Validation failed' && error.details) {
        const backendErrors: FormErrors = {};
        error.details.forEach((err) => {
          backendErrors[err.path[0]] = err.message;
        });
        setErrors(backendErrors);
      } else {
        setErrors({ general: error.message || 'Registration failed' });
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { createAccount, isLoading, errors, successMessage };
};
```

**services/accountAPI.ts** (48 строк)

```typescript
class AccountAPI {
  private async request<T>(endpoint: string, options: RequestInit): Promise<T> {
    const url = `${BACKEND_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw {
        status: response.status,
        ...data,
      } as ApiError & { status: number };
    }

    return data as T;
  }

  async createAccount(
    formData: CreateAccountFormData
  ): Promise<AccountResponse> {
    return this.request<AccountResponse>('/api/accounts', {
      method: 'POST',
      body: JSON.stringify({
        title: formData.title,
        type: formData.type,
        balance: formData.balance,
        currency: formData.currency,
        createdBy: 1,
        userId: 1,
      }),
    });
  }
}

export const accountAPI = new AccountAPI();
```

**Использование в компоненте:**

```typescript
function AccountForm() {
  const { createAccount, isLoading, errors, successMessage } =
    useCreateAccount();

  const handleSubmit = async (formData) => {
    const success = await createAccount(formData);
    if (success) {
      // Нужно вручную обновлять список аккаунтов
      refetchAccounts();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* ... */}
      <button disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create'}
      </button>
      {errors.general && <div>{errors.general}</div>}
      {successMessage && <div>{successMessage}</div>}
    </form>
  );
}
```

**Проблемы:**

- ❌ Дублирование логики (каждый запрос = новый хук)
- ❌ Ручное управление состоянием (useState для каждого поля)
- ❌ Нет кэширования
- ❌ Нужно вручную обновлять данные после мутации
- ❌ Дублирование request логики в каждом API классе
- ❌ Нет retry, optimistic updates, и других оптимизаций

---

### ✅ НОВЫЙ ПОДХОД (TanStack Query)

**lib/api-client.ts** (118 строк, переиспользуется везде)

```typescript
class APIClient {
  async post<T>(
    endpoint: string,
    body?: unknown,
    config?: RequestConfig
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }
  // ... другие методы (get, put, delete)
}

export const apiClient = new APIClient();
```

**api/accounts/mutations.ts** (всего 25 строк)

```typescript
export const useCreateAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: CreateAccountFormData) => {
      const token = localStorage.getItem('authToken');

      return apiClient.post<AccountResponse>(
        '/api/accounts',
        {
          title: formData.title,
          type: formData.type,
          balance: formData.balance,
          currency: formData.currency,
          createdBy: 1,
          userId: 1,
        },
        { token: token || undefined }
      );
    },
    onSuccess: () => {
      // Автоматически обновляет все запросы аккаунтов
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts.all });
    },
  });
};
```

**Использование в компоненте:**

```typescript
function AccountForm() {
  const createAccount = useCreateAccount();

  const handleSubmit = async (formData) => {
    try {
      await createAccount.mutateAsync(formData);
      // Всё! Данные автоматически обновились
    } catch (error) {
      // Обработка ошибки
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* ... */}
      <button disabled={createAccount.isPending}>
        {createAccount.isPending ? 'Creating...' : 'Create'}
      </button>
      {createAccount.isError && <div>Error: {createAccount.error.message}</div>}
      {createAccount.isSuccess && <div>Success!</div>}
    </form>
  );
}
```

**Преимущества:**

- ✅ Один API client для всего
- ✅ Автоматическое управление состоянием (loading, error, success)
- ✅ Автоматическое кэширование
- ✅ Автоматическое обновление данных после мутации
- ✅ Retry, optimistic updates из коробки
- ✅ DevTools для отладки
- ✅ Меньше кода

---

## Пример 2: Получение данных

### ❌ СТАРЫЙ ПОДХОД

```typescript
function AccountsList() {
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAccounts = async () => {
      setIsLoading(true);
      try {
        const data = await accountAPI.getAccounts();
        setAccounts(data);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error!</div>;
  return <div>{/* render accounts */}</div>;
}
```

**Проблемы:**

- ❌ Каждый компонент делает свой запрос
- ❌ Нет кэширования (открыл компонент = новый запрос)
- ❌ Много boilerplate кода
- ❌ Нет автоматического refetch

---

### ✅ НОВЫЙ ПОДХОД

```typescript
function AccountsList() {
  const { data: accounts, isLoading, error } = useAccounts();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error!</div>;
  return <div>{/* render accounts */}</div>;
}
```

**Преимущества:**

- ✅ Данные кэшируются (повторный рендер = нет запроса)
- ✅ Автоматический refetch при focus окна
- ✅ Минимум кода
- ✅ Синхронизация между компонентами

---

## Пример 3: Несколько запросов

### ❌ СТАРЫЙ ПОДХОД

```typescript
function Dashboard() {
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [accountsData, transactionsData, userData] = await Promise.all([
          accountAPI.getAccounts(),
          transactionAPI.getTransactions(),
          authAPI.getCurrentUser(),
        ]);
        setAccounts(accountsData);
        setTransactions(transactionsData);
        setUser(userData);
      } catch (err) {
        // ...
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // ...
}
```

**Проблемы:**

- ❌ Сложная логика
- ❌ Если один запрос упал, нужно обрабатывать вручную
- ❌ Нет кэширования
- ❌ Сложно добавить новый запрос

---

### ✅ НОВЫЙ ПОДХОД

```typescript
function Dashboard() {
  const { data: accounts } = useAccounts();
  const { data: transactions } = useTransactions();
  const { data: user } = useCurrentUser();

  // Всё! TanStack Query автоматически:
  // - Выполняет запросы параллельно
  // - Кэширует данные
  // - Обрабатывает ошибки
  // - Показывает loading состояния
}
```

**Преимущества:**

- ✅ Простота
- ✅ Автоматическая обработка
- ✅ Легко добавлять новые запросы
- ✅ Независимые loading/error состояния для каждого запроса

---

## Итоговое сравнение

| Критерий                     | Старый подход         | Новый подход (TanStack Query)      |
| ---------------------------- | --------------------- | ---------------------------------- |
| **Кол-во кода**              | ~200 строк на feature | ~30 строк на feature               |
| **Кэширование**              | Нет                   | Автоматическое                     |
| **Управление состоянием**    | Ручное (useState)     | Автоматическое                     |
| **Обновление после мутаций** | Ручное                | Автоматическое                     |
| **Оптимизации**              | Нет                   | Retry, refetch, optimistic updates |
| **DevTools**                 | Нет                   | Есть                               |
| **Поддержка**                | Кастомный код         | Индустриальный стандарт            |
| **Тестируемость**            | Сложно                | Легко                              |
| **Масштабируемость**         | Плохая                | Отличная                           |

---

## Вывод

**Старый подход** требовал:

- Написать хук для каждого запроса
- Написать метод в API классе для каждого endpoint
- Вручную управлять состоянием
- Вручную обновлять данные

**Новый подход** даёт:

- ✅ Один `apiClient` для всех запросов
- ✅ Простые query/mutation хуки
- ✅ Автоматическое управление всем
- ✅ Меньше кода, больше возможностей

**Рекомендация:** Мигрируй на новый подход и удали старые файлы:

- `hooks/useCreate*.ts`
- `services/*API.ts`
