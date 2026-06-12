# Console Frame

A production-ready React admin console framework. Batteries included: authentication, theming, i18n, responsive layout, table kit, global search, and 11 demo pages.

**Designed for AI-assisted development** — clone, describe your business logic to your AI, and fill in the pages.

## Features

- **🎨 Theme Engine** — 6 built-in color presets, light/dark/system modes, 3 density levels, side/top layouts
- **🔐 Auth System** — Login, password reset, token-based route guards, mock API ready
- **🌍 i18n** — English, 中文, Deutsch with runtime switching
- **📊 Table Kit** — Reusable `SearchBar` + `DataTable` components with built-in search, pagination, row actions
- **🔍 Command Palette** — `⌘K` global search across pages and actions
- **📱 Responsive** — Side navigation with collapsible icon rail, mobile drawer
- **📈 Charts** — Recharts integration (Line, Bar, Pie, Area)
- **🧩 antd 6.x** — Full antd component library with token-based theming

## Quick Start

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Build for production
pnpm build

# Type check
pnpm typecheck
```

The dev server starts at `http://localhost:9000`.

**Login:** Enter any email and password. The mock auth system accepts any credentials.

## Project Structure

```
console-frame/
├── public/                  # Static assets
├── src/
│   ├── main.tsx             # Entry point
│   ├── App.tsx              # Placeholder (router is separate)
│   ├── auth/                # Auth core, mock API, logout
│   │   ├── core.ts          # Token/userInfo storage, redirect helpers
│   │   ├── mock-api.ts      # Mock data generators & API functions
│   │   ├── request.ts       # Mock request base (replace with real HTTP)
│   │   └── logout.ts        # Logout helper
│   ├── components/           # Shared components
│   │   ├── table-kit/        # Generic SearchBar + DataTable
│   │   └── UserAvatar.tsx    # User avatar component
│   ├── config/               # App configuration
│   │   ├── routes.tsx        # Menu data and utilities
│   │   └── menuFilter.ts     # Menu permission filter
│   ├── i18n/                 # Internationalization (inlined)
│   │   ├── index.tsx         # I18nProvider, useI18n, types, store, utilities
│   │   ├── en.ts             # English translations
│   │   ├── zh.ts             # Chinese translations
│   │   ├── de.ts             # German translations
│   │   └── messages.ts       # Messages barrel export
│   ├── layout/               # App shell
│   │   ├── MainLayout.tsx    # Header, Sider, TopNav, mobile Drawer
│   │   ├── SettingsDrawer.tsx # Theme/layout/language settings panel
│   │   └── siderPresentation.ts
│   ├── pages/                # Page components
│   │   ├── LoginPage.tsx      # Login + forgot password
│   │   ├── NotFound.tsx       # 404 page
│   │   ├── overview/          # Overview category
│   │   │   ├── DashboardPage.tsx       # Welcome dashboard
│   │   │   ├── MockDashboardPage.tsx   # Analytics with charts
│   │   │   └── DesignTokenPage.tsx     # Theme token explorer
│   │   ├── components-demo/   # Component demos
│   │   │   ├── TableDemoPage.tsx       # Table kit CRUD demo
│   │   │   ├── FormDemoPage.tsx        # Basic/Step/Dynamic forms
│   │   │   ├── ChartsDemoPage.tsx      # Recharts examples
│   │   │   └── DataDisplayPage.tsx     # Cards, stats, timeline
│   │   └── examples/          # Business example pages
│   │       ├── UserManagementPage.tsx  # CRUD table
│   │       ├── ProductCatalogPage.tsx  # Card + table views
│   │       ├── TaskBoardPage.tsx       # Task management
│   │       └── ActivityLogPage.tsx     # Activity timeline
│   ├── router/               # React Router setup
│   │   ├── index.tsx         # Route tree
│   │   └── RequireAuth.tsx   # Auth guard
│   ├── search/               # Global search (Cmd+K)
│   ├── styles/               # Global CSS + fonts
│   ├── theme/                # Theme engine
│   │   ├── themeConfig.ts    # Token build, presets, CSS vars
│   │   ├── ThemeSettingsProvider.tsx  # ConfigProvider + Context
│   │   ├── themeStorage.ts   # localStorage persistence
│   │   └── types.ts          # Type definitions
│   └── utils/                # Utility functions
└── package.json
```

## How to Use

### 1. Replace Mock APIs

All mock APIs are in `src/auth/mock-api.ts`. Replace the `delay()` + fake data functions with real HTTP calls:

```ts
// Before (mock)
export async function mockGetUsers(params) {
  await delay();
  // ...fake data logic
}

// After (real API)
export async function getUsers(params) {
  const response = await fetch('/api/users?' + new URLSearchParams(params));
  return response.json();
}
```

### 2. Add Business Pages

1. Create a new page component in `src/pages/<domain>/`
2. Register the route in `src/router/index.tsx`
3. Add the menu item in `src/config/routes.tsx`
4. Add i18n keys in `src/i18n/en.ts` (and `zh.ts` / `de.ts` if needed)

### 3. Customize the Theme

Edit `src/theme/themeConfig.ts` to:
- Change default preset, colors, or fonts
- Add new theme presets
- Customize component tokens

Or use the Settings Drawer (`🎨` icon in the header) to configure interactively.

### 4. Change Auth Logic

Replace mock auth in `LoginPage.tsx`:

```ts
// Replace mockLogin with your auth provider
import { signIn } from 'next-auth/react'; // or any auth library
```

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.x | UI framework |
| TypeScript | 5.x | Type safety |
| Vite | 5.x | Build tool |
| antd | 6.x | Component library |
| React Router | 6.x | Client-side routing |
| Recharts | 2.x | Charts |
| Lucide React | 1.x | Icons |
| dayjs | 1.x | Date handling |

## Menu Structure (3 categories, 11 pages)

| Category | Page | Description |
|----------|------|-------------|
| **Overview** | Dashboard | Welcome page with stats & quick links |
| | Mock Dashboard | Full analytics with charts |
| | Design Tokens | Theme token explorer |
| **Components** | Table Demo | CRUD table with search & pagination |
| | Form Demo | Basic, step, and dynamic forms |
| | Charts Demo | Line, bar, pie, area charts |
| | Data Display | Cards, stats, progress, timeline |
| **Examples** | User Management | Full CRUD with drawer forms |
| | Product Catalog | Card grid + table views |
| | Task Board | Status-based task management |
| | Activity Log | Timeline activity feed |

## License

MIT
