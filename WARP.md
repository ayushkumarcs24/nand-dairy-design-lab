# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Commands and workflows

This is a Vite + React + TypeScript SPA with Tailwind CSS and shadcn-ui.

### Environment
- Requires Node.js and npm (see `README.md`).
- Use npm (not yarn/pnpm) as the primary package manager.

### Install dependencies
```sh
npm install
```

### Local development
- Start the dev server (Vite, configured to listen on port `8080`):
```sh
npm run dev
```

### Build
- Production build:
```sh
npm run build
```
- Development-mode build (uses Vite's `--mode development`):
```sh
npm run build:dev
```

### Preview built app
- Build and then run the preview server:
```sh
npm run build
npm run preview
```

### Linting
- Run ESLint over the TypeScript/React source using the flat config in `eslint.config.js`:
```sh
npm run lint
```

### Tests
- There is currently **no test script** defined in `package.json` and no test runner configured. Do not assume `npm test` or single-test commands will work until a test setup is added.

## High-level architecture

### Tooling and config
- **Bundler/dev server**: Vite (`vite.config.ts`)
  - Uses `@vitejs/plugin-react-swc`.
  - Defines an alias `@` → `./src`, so imports like `"@/components/ui/button"` resolve into `src/components/ui/button`.
  - Dev server is configured to listen on `::` (all interfaces) at port `8080`.
- **TypeScript config**: `tsconfig.json`
  - Sets `baseUrl` to the repo root and configures `@/*` path mapping consistent with the Vite alias.
  - Loosens some strictness flags (`noImplicitAny: false`, `strictNullChecks: false`, etc.), so type errors may not be enforced aggressively.
- **Styling**: Tailwind CSS (`tailwind.config.ts`, `postcss.config.js`)
  - Tailwind scans `./src/**/*.{ts,tsx}` (and some legacy `pages`, `components`, `app` globs).
  - The theme defines a design system via CSS variables (`--primary`, `--sidebar-*`, etc.) and custom animations (`accordion-*`, `fade-in`, `float`, etc.).
- **Linting**: `eslint.config.js`
  - Uses the flat config style with `@eslint/js` + `typescript-eslint` and React-specific plugins.
  - Files targeted: `**/*.{ts,tsx}`.
  - React hooks rules are enabled; `@typescript-eslint/no-unused-vars` is explicitly turned off.

### Application entry and routing
- **Entry point**: `src/main.tsx`
  - Imports global styles (`./index.css`).
  - Renders `<App />` into the `#root` element defined in `index.html`.
- **Top-level app shell**: `src/App.tsx`
  - Wraps the app with:
    - `QueryClientProvider` from `@tanstack/react-query` (global query client; ready for data fetching, even if not heavily used yet).
    - `TooltipProvider` for UI tooltips.
    - Two toaster systems: `@/components/ui/toaster` and `@/components/ui/sonner` for notifications.
  - Uses `BrowserRouter` from `react-router-dom` to define routes:
    - `/` → `Login` (role selection page).
    - `/admin-login`, `/samiti-login`, `/farmer-login`, `/distributor-login`, `/logistics-login` → role-specific login screens.
    - `/index` → marketing/storytelling landing page (`Index` component).
    - `/admin/dashboard` → admin dashboard shell and widgets.
    - `/farmer/dashboard` → farmer dashboard shell.
    - `/farmer-orders`, `/farmer-products`, `/farmer-customers`, `/farmer-analytics` → farmer sub-pages.
    - `*` → `NotFound` (404 page logging missing routes to `console.error`).
  - When adding new screens, follow this pattern and insert new `<Route>`s **above** the `"*"` catch-all.

### Pages and flows
- **Role selection**: `src/pages/Login.tsx`
  - Landing experience that lets the user choose between Owner/Admin, Samiti, Farmer, Distributor, and Logistics roles.
  - Uses `useNavigate` from `react-router-dom` to push into the appropriate `*-login` routes.
  - Encapsulates per-role cards with Framer Motion animations.
- **Login screens**:
  - `AdminLogin.tsx`, `FarmerLogin.tsx`, `DistributorLogin.tsx`, `LogisticsLogin.tsx`, `SamitiLogin.tsx` under `src/pages/`.
  - Common patterns:
    - Use shadcn UI form primitives (`Button`, `Input`, `Label`).
    - Use `useState` for local form state and lucide icons for password visibility toggles.
    - On submit, most pages currently **log to the console**; only Admin and Farmer login perform hard redirects via `window.location.href` to their dashboards (`/admin/dashboard`, `/farmer/dashboard`).
  - If you introduce real authentication, favor React Router navigation (`useNavigate`) over `window.location.href` to maintain SPA behavior.
- **Dashboards**:
  - Admin:
    - `src/pages/admin/AdminDashboard.tsx` composes the admin layout and content.
    - Uses layout components from `src/components/layout` and admin widgets (`AdminCards`, `AdminCharts`, `AdminLists`).
  - Farmer:
    - `src/pages/FarmerDashboard.tsx` composes the farmer layout with a sidebar and responsive header.
    - Detailed farmer views (orders, products, customers, analytics) live in `src/pages/farmer/` and are routed via top-level routes in `App.tsx`.
- **Marketing / storytelling**:
  - `src/pages/Index.tsx` serves as a storytelling scroll page ("From Farm to Your Family" journey) with Framer Motion animations and static content.
  - This route is currently mounted at `/index` (not at `/`).

### Layout and navigation components
- **Layout components** (`src/components/layout/*`):
  - `AdminSidebar`, `AdminMobile`, `AdminDesktop` compose the admin navigation shell (sidebar, mobile header, desktop header/search/profile menu).
  - `Sidebar`, `FarmerMobile`, `FarmerDesktop` compose the farmer shell with a left navigation and responsive top bar.
  - Layout components are primarily structural/presentational; business logic lives in pages.
- **Navigation helper**: `src/components/NavLink.tsx`
  - A compatibility wrapper around `react-router-dom`'s `NavLink` that adds `activeClassName`/`pendingClassName` props and uses the shared `cn` utility.
  - Use this when you need nav links that respond to the current route state.
- **Header**: `src/components/ui/header.tsx`
  - Fixed top navigation used on the storytelling/marketing page.
  - Contains links to `/about`, `/products`, `/contact` which currently do **not** have route handlers; navigating there falls back to the 404 page.

### UI primitives and utilities
- **shadcn-ui layer**: `src/components/ui/*`
  - Contains reusable components (buttons, forms, dialogs, sheets, sidebar primitives, toast/sonner wrappers, etc.).
  - Most of these are low-level and style-focused; screens should compose them rather than embed complex logic here.
- **Hooks**: `src/hooks/`
  - `use-mobile.tsx` exposes `useIsMobile()` — a responsive hook based on a `matchMedia` breakpoint at 768px.
- **Utilities**: `src/lib/utils.ts`
  - Includes `cn` (class name merge helper) and potentially other shared utilities.

### Data and state considerations
- `@tanstack/react-query` is wired at the root (`QueryClientProvider`) but not heavily used yet.
  - When adding API integration, prefer `useQuery`/`useMutation` hooks rather than ad-hoc `fetch` in components, and keep API-related code in dedicated modules (e.g., `src/lib/api/*` or `src/services/*`) to avoid coupling UI and networking.
- Current login flows are client-only and rely on redirects/logging; there is no persistent auth state or token handling in this repo.

### Routing and URL patterns
- The codebase currently mixes dashed and nested path segments (`/farmer/dashboard` vs `/farmer-orders`).
  - When adding new routes, maintain consistency with existing patterns or, if refactoring, update both the routes in `App.tsx` and any sidebar/nav links (`Sidebar`, `Header`, login redirects).
- The `NotFound` page logs missing paths with `console.error` whenever a user hits an undefined route; this can be useful when debugging navigation issues.
