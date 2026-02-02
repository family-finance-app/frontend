# Authentication System

This document describes the authentication system for the Family Finance application, including guards, context, and hooks.

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Components](#components)
4. [Route Protection](#route-protection)
5. [Token Management](#token-management)
6. [Usage Examples](#usage-examples)
7. [Security Features](#security-features)

---

## Overview

The authentication system provides:

- JWT-based authentication with automatic token refresh
- Global route protection via AuthGuard
- Centralized auth state management via AuthContext
- Secure token storage in localStorage
- Automatic session handling and cleanup

NOTE: Automatic token refresh flow works only in production due to HTTPS cookies policy!

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    App Providers                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ QueryClientProvider                              │   │
│  │  ┌─────────────────────────────────────────┐    │   │
│  │  │ AuthProvider                             │    │   │
│  │  │  ┌─────────────────────────────────┐    │    │   │
│  │  │  │ AuthGuard                        │    │    │   │
│  │  │  │  └─ Protected Routes             │    │    │   │
│  │  │  └─────────────────────────────────┘    │    │   │
│  │  └─────────────────────────────────────────┘    │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### File Structure

```
app/
├── providers.tsx                    # Root providers setup
├── components/guards/
│   ├── AuthContext.tsx              # Auth state context & provider
│   └── AuthGuard.tsx                # Route protection component
├── lib/
│   └── api-client.ts                # API client with token refresh
└── utils/
    └── token.ts                     # Token storage utilities
```

---

## Components

### AuthProvider

**Location:** `/app/components/guards/AuthContext.tsx`

Provides authentication state to the entire application.

```tsx
import AuthProvider from '@/components/guards/AuthContext';

<AuthProvider>
  <App />
</AuthProvider>;
```

**Context Value:**

| Property          | Type                      | Description                  |
| ----------------- | ------------------------- | ---------------------------- |
| `token`           | `string \| null`          | Current JWT access token     |
| `setToken`        | `(token: string) => void` | Store new token              |
| `clearToken`      | `() => void`              | Clear token and logout       |
| `isAuthenticated` | `boolean`                 | Whether user has valid token |

**Features:**

- Listens for `storage` events to sync auth state across tabs
- Listens for `auth:logout` custom events for forced logout
- Invalidates React Query caches on auth state change

### AuthGuard

**Location:** `/app/components/guards/AuthGuard.tsx`

Protects routes based on authentication status.

```tsx
import AuthGuard from '@/components/guards/AuthGuard';

<AuthGuard>
  <ProtectedContent />
</AuthGuard>;
```

**Behavior:**

| Route Type                    | Authenticated            | Unauthenticated        |
| ----------------------------- | ------------------------ | ---------------------- |
| Public (`/`)                  | Allow                    | Allow                  |
| Auth (`/sign-in`, `/sign-up`) | Redirect to `/dashboard` | Allow                  |
| Protected (all others)        | Allow                    | Redirect to `/sign-in` |

**Loading States:**

- Shows spinner during initial auth check
- Displays "Authenticating...", "Redirecting...", etc.

### useAuth Hook

**Location:** `/app/components/guards/AuthContext.tsx`

Access auth state from any component.

```tsx
import { useAuth } from '@/components/guards/AuthContext';

function MyComponent() {
  const { token, isAuthenticated, setToken, clearToken } = useAuth();

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return <div>Welcome!</div>;
}
```

---

## Route Protection

### Public Routes

No authentication required:

- `/` - Landing page
- `/_next/*` - Next.js internal routes

### Auth Routes

Unauthenticated users only (redirects authenticated users to dashboard):

- `/sign-in` - Login page
- `/sign-up` - Registration page

### Protected Routes

Authentication required (redirects unauthenticated users to sign-in):

- `/dashboard` - Main dashboard
- `/accounts` - Account management
- `/transactions` - Transaction history
- `/analytics` - Financial analytics
- `/settings` - User settings
- `/settings/profile` - Profile settings
- `/settings/security` - Security settings
- `/family-group` - Family sharing

---

## Token Management

### Storage

Tokens are stored in localStorage:

```typescript
// utils/token.ts
const TOKEN_KEY = 'auth_token';

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAuthToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}
```

### Token Refresh

The API client automatically refreshes expired tokens:

```typescript
// lib/api-client.ts

async refreshToken(): Promise<string | null> {
  const response = await fetch('/auth/refresh', {
    method: 'POST',
    credentials: 'include', // Sends httpOnly refresh token cookie
  });

  if (response.ok) {
    const { accessToken } = await response.json();
    setAuthToken(accessToken);
    return accessToken;
  }

  clearAuthToken();
  return null;
}
```

**Flow:**

1. API request fails with 401 Unauthorized
2. Client attempts token refresh via `/auth/refresh`
3. If refresh succeeds, retry original request
4. If refresh fails, clear token and dispatch `auth:logout`

NOTE: Refresh flow works only in production due to HTTPS cookies policy! In local development the 4th step will always be executed.

### Cross-Tab Synchronization

Auth state syncs across browser tabs:

```typescript
useEffect(() => {
  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === TOKEN_KEY) {
      setTokenState(e.newValue);
    }
  };

  window.addEventListener('storage', handleStorageChange);
  return () => window.removeEventListener('storage', handleStorageChange);
}, []);
```

---

## Usage Examples

### Check Authentication

```tsx
import { useAuth } from '@/components/guards/AuthContext';

function ProfileButton() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Link href="/sign-in">Sign In</Link>;
  }

  return <Link href="/settings/profile">Profile</Link>;
}
```

### Manual Login

```tsx
import { useAuth } from '@/components/guards/AuthContext';

function LoginForm() {
  const { setToken } = useAuth();

  const handleLogin = async (credentials) => {
    const { accessToken } = await signIn(credentials);
    setToken(accessToken);
    // AuthGuard will redirect to dashboard
  };
}
```

### Manual Logout

```tsx
import { useAuth } from '@/components/guards/AuthContext';

function LogoutButton() {
  const { clearToken } = useAuth();

  const handleLogout = () => {
    clearToken();
    // AuthGuard will redirect to sign-in
  };

  return <button onClick={handleLogout}>Logout</button>;
}
```

### Protected API Calls

```tsx
import { apiClient } from '@/lib/api-client';

// Token is automatically attached to requests
const accounts = await apiClient.get('/accounts');

// If 401, token refresh is attempted automatically
```

---

## Security Features

### Token Validation

- Tokens are validated on every protected route access
- Invalid tokens are automatically cleared
- Expired tokens trigger refresh flow
  NOTE: Refresh flow works only in production due to HTTPS cookies policy! In local development session expiration will always be executed

### Session Expiration

When sessions expire:

1. API returns 401 Unauthorized
2. Client attempts token refresh
3. If refresh fails, token is cleared
4. User sees "Session expired..." message
5. Redirect to sign-in page

### CSRF Protection

- Access tokens stored in localStorage (not cookies)
- Refresh tokens use httpOnly cookies
- API validates token on every request

### XSS Mitigation

- React escapes output by default
- No `dangerouslySetInnerHTML` usage
- Content Security Policy headers (server-side)

---

## Troubleshooting

### Issue: Infinite redirect loop

**Cause:** Token exists but is invalid, causing repeated auth checks.

**Solution:** Clear localStorage and try again:

```javascript
localStorage.removeItem('auth_token');
```

### Issue: Token not persisting

**Cause:** localStorage blocked or in private browsing.

**Solution:** Check browser settings or use different storage strategy.

### Issue: Auth state not syncing across tabs

**Cause:** Storage event listener not firing.

**Solution:** Ensure using `localStorage`, not `sessionStorage`.

---

## Implementation Benefits

1. **Global Protection** - Single guard protects entire application
2. **User Experience** - Smooth redirects with loading feedback
3. **Security** - Comprehensive token validation and cleanup
4. **Developer Experience** - Simple `useAuth` hook for auth state
5. **Performance** - Efficient token checking before API calls
6. **Maintainability** - Centralized auth logic in one place
