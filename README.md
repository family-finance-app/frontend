# Family Finance

A personal and family financial management application built with Next.js 16 and React 19.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss)

## Overview

Family Finance helps users track personal and shared family finances with real-time currency conversion, comprehensive analytics, and an intuitive dashboard. The app supports multi-currency accounts (UAH, USD, EUR) with automatic exchange rate updates from the Monobank.

### Key Features

- **Dashboard** - Real-time financial overview with income/expense statistics
- **Multi-Currency Accounts** - Support for UAH, USD, and EUR with automatic conversion
- **Transaction Management** - Track income, expenses, and transfers
- **Analytics** - Visual charts for spending patterns and savings trends
- **Family Groups** - Share accounts and track family finances together (WIP)
- **Dark Mode** - Full dark/light theme support
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Onboarding Tutorial** - Interactive guide for new users

## Quick Start

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, pnpm, or bun
- Backend setup (server, database) [https://github.com/family-finance-app/backend]

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd family-finance/frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your backend URL

# Run development server
npm run dev
```

Open [http://localhost:3500](http://localhost:3500) in your browser.

### Environment Variables

```env
NEXT_PUBLIC_BACKEND_URL=https://your-api-url.com
```

## Hosted Environments

| Environment | URL                            |
| ----------- | ------------------------------ |
| Production  | https://familyfinance.site     |
| Development | https://dev.familyfinance.site |

## Architecture

### Tech Stack

| Category         | Technology                     |
| ---------------- | ------------------------------ |
| Framework        | Next.js 16 (App Router)        |
| UI Library       | React 19                       |
| Language         | TypeScript 5                   |
| Styling          | Tailwind CSS 4                 |
| State Management | React Query (TanStack Query 5) |
| Charts           | Recharts 3                     |
| Icons            | Remix Icons                    |
| Deployment       | Cloudflare Pages               |

### Project Structure

```
frontend/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication routes (sign-in, sign-up)
│   │   ├── components/           # Auth-specific components
│   │   ├── hooks/                # Auth hooks (useSignIn, useSignUp)
│   │   └── utils/                # Validation utilities
│   │
│   ├── (main layout)/            # Protected app routes
│   │   ├── accounts/             # Account management
│   │   ├── analytics/            # Financial analytics & charts
│   │   ├── dashboard/            # Main dashboard
│   │   ├── family-group/         # Family sharing features
│   │   ├── settings/             # User settings & profile
│   │   ├── transactions/         # Transaction management
│   │   └── data/                 # MainDataProvider context
│   │
│   ├── api/                      # API layer (queries & mutations)
│   │   ├── accounts/             # Account CRUD operations
│   │   ├── auth/                 # Authentication API
│   │   ├── categories/           # Transaction categories
│   │   ├── exchangeRate/         # Exchange rates for UAH, EUR, USD
│   │   ├── profile/              # User profile
│   │   ├── security/             # Password & security
│   │   └── transactions/         # Transaction CRUD operations
│   │
│   ├── assets/                   # Static assets & styles
│   │   ├── css/globals.css       # Global styles & Tailwind config
│   │   └── fonts/                # Custom fonts (Geist, Roboto)
│   │
│   ├── components/               # Shared UI components
│   │   ├── cards/                # Card components
│   │   ├── charts/               # Chart components (Area, Bar, Donut)
│   │   ├── forms/                # Form components
│   │   ├── guards/               # Auth guards & context
│   │   ├── layout/               # Navigation, Sidebar, Footer
│   │   ├── modals/               # Modal components
│   │   └── ui/                   # Base UI components
│   │
│   ├── features/                 # Landing page features
│   ├── hooks/                    # Global custom hooks
│   ├── lib/                      # Core utilities (API client, query client)
│   ├── notifications/            # Toast notifications
│   ├── onboarding/               # Interactive tutorial system
│   ├── theme/                    # Theme management
│   └── utils/                    # Helper functions
│
├── docs/                         # Technical documentation
├── public/                       # Static files
└── [config files]                # Next.js, Tailwind, TypeScript configs
```

### Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        App Providers                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌────────────────┐  │
│  │ QueryClient     │  │ AuthProvider    │  │ OnboardingProv │  │
│  │ Provider        │  │ (Token Mgmt)    │  │                │  │
│  └────────┬────────┘  └────────┬────────┘  └────────────────┘  │
└───────────┼────────────────────┼────────────────────────────────┘
            │                    │
            ▼                    ▼
┌───────────────────────────────────────────────────────────────┐
│                    MainDataProvider                            │
│  Centralizes: accounts, transactions, categories, exchangeRates│
└───────────────────────────────────────────────────────────────┘
            │
            ▼
┌───────────────────────────────────────────────────────────────┐
│                      Page Components                           │
│  Dashboard │ Accounts │ Transactions │ Analytics │ Settings   │
└───────────────────────────────────────────────────────────────┘
```

## Core Features

### Authentication System

- JWT-based authentication with automatic token refresh (production only)
- Secure token storage in localStorage
- Global AuthGuard protecting all routes
- Automatic redirect for unauthenticated users

**Protected Routes:** All routes except `/`, `/sign-in`, `/sign-up`

### Dashboard

The dashboard provides a comprehensive financial overview:

- **Total Balance Widget** - All accounts converted to UAH equivalent
- **Period Statistics** - Income/expenses for week/month/year
- **Recent Transactions** - Last 5 transactions
- **Category Breakdown** - Monthly spending by category

### Multi-Currency Support

Supports three currencies with automatic conversion:

| Currency | Symbol | Exchange Rate Source |
| -------- | ------ | -------------------- |
| UAH      | ₴      | Base currency (1:1)  |
| USD      | $      | Monobank API         |
| EUR      | €      | Monobank API         |

Exchange rates update automatically every 2 hours from Monobank API.

### Account Management

- **Personal Accounts** - Individual bank accounts, cash, savings
- **Family Accounts** - Shared accounts for family members (WIP)
- **Account Types:** Bank Account, Cash, Credit Card, Debit Card, Deposit, Digital, Savings, Investment

### Transaction Tracking

- **Income** - Track all income sources
- **Expenses** - Categorize and monitor spending
- **Transfers** - Move money between accounts
- **Filtering** - By type, time range, and category

### Analytics

Visual insights into financial patterns:

- **Monthly Income vs Expenses** - Area chart comparison
- **Spending by Category** - Donut chart breakdown
- **Savings Trend** - Bar chart over time
- **Income Sources** - Category distribution

### Onboarding Tutorial

Interactive guide for new users covering:

1. Creating first account
2. Adding transactions
3. Understanding the dashboard
4. Currency conversion explanation

## API Layer

### API Client (`/app/lib/api-client.ts`)

Centralized HTTP client with:

- Automatic token attachment
- Token refresh on 401 responses (production only)
- Error handling and logging
- External API support

### React Query Integration

All data fetching uses TanStack Query with:

- Automatic caching and background refetching
- Optimistic updates for mutations
- Query invalidation on data changes

**Query Keys Structure:**

```typescript
queryKeys = {
  auth: { currentUser: ['auth', 'currentUser'] },
  accounts: { all: ['accounts'] },
  transactions: { all: ['transactions'] },
  categories: { all: ['categories'] },
  exchangeRate: { all: ['exchange-rates'] },
  profile: { all: ['profile'] },
};
```

## Components Library

### Charts (`/app/components/charts/`)

| Component     | Description                    |
| ------------- | ------------------------------ |
| `AreaChart`   | Time series data visualization |
| `BarChart`    | Comparative bar charts         |
| `DonutChart`  | Category distribution          |
| `ProgressBar` | Linear progress indicator      |

### Forms (`/app/components/forms/`)

Reusable form components with validation support.

### Modals (`/app/components/modals/`)

| Component        | Description             |
| ---------------- | ----------------------- |
| `EditModal`      | Generic edit form modal |
| `DeleteModal`    | Confirmation dialog     |
| `SuccessMessage` | Success toast           |
| `ErrorMessage`   | Error toast             |

### Layout (`/app/components/layout/`)

| Component    | Description          |
| ------------ | -------------------- |
| `Navigation` | Top navigation bar   |
| `Sidebar`    | Side navigation menu |
| `Footer`     | Page footer          |

## Styling

### Tailwind CSS 4

The app uses Tailwind CSS v4 with:

- Custom color palette (primary, background, stack)
- Dark mode support via `class` strategy
- Custom screen breakpoints

**Breakpoints:**

| Name  | Range           |
| ----- | --------------- |
| `s`   | max: 599px      |
| `m`   | 600px - 1023px  |
| `l`   | 1024px - 1535px |
| `xlg` | min: 1536px     |

### Theme Colors

Defined in `/app/assets/css/globals.css`:

- Primary colors (brand identity)
- Background colors (light/dark)
- Stack colors (text, borders)
- Semantic colors (success, warning, error)

## Scripts

```bash
# Development
npm run dev              # Start dev server (port 3500)

# Production
npm run build            # Build for production
npm run start            # Start production server

# Deployment
npm run deploy:cloudflare  # Deploy to Cloudflare Pages

# Code Quality
npm run lint             # Run ESLint
```

## Deployment

### Cloudflare Pages

The app is configured for Cloudflare Pages deployment:

```bash
npm run deploy:cloudflare
```

Configuration in `wrangler.toml`:

- Production: `family-finance-prod`
- Preview/Staging: `family-finance-staging`

### Build Output

- Static export (`output: 'export'` in production)
- Output directory: `out/`

## Development Guidelines

### File Naming Conventions

- Components: `PascalCase.tsx`
- Hooks: `useCamelCase.ts`
- Utilities: `camelCase.ts`
- Types: `types.ts` (per feature)

### Component Structure

```tsx
'use client';

import { useState } from 'react';
import { ComponentProps } from './types';

export default function ComponentName({ prop }: ComponentProps) {
  // State
  // Effects
  // Handlers
  // Render
}
```

### Adding New Features

1. Create feature folder in appropriate route group
2. Add types in `types.ts`
3. Create components in `components/`
4. Add hooks in `hooks/`
5. Add API queries/mutations in `/app/api/`
6. Export from `index.ts`

## Documentation

Detailed documentation available in `/docs/`:

- [auth-guard.md](docs/auth-guard.md) - Authentication implementation
- [dashboard.md](docs/dashboard.md) - Dashboard architecture
- [exchange-rate.md](docs/exchange-rate.md) - Currency conversion system

## License

Private - All rights reserved.
