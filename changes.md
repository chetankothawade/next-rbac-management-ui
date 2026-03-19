# React Vite to Next.js Migration Changes

This file documents the main conversion changes applied while migrating the project from a React + Vite app to a Next.js App Router app.

## 1. Project Runtime Migration

- Replaced Vite-based scripts with Next.js scripts in [`package.json`](/d:/ui/react_next/package.json)
- Removed old Vite entry/runtime files:
  - `vite.config.js`
  - `index.html`
  - `src/main.jsx`
  - `src/App.jsx`
  - old React Router route config files under `src/routes`
- Added Next.js project files:
  - [`next.config.mjs`](/d:/ui/react_next/next.config.mjs)
  - [`jsconfig.json`](/d:/ui/react_next/jsconfig.json)

## 2. App Router Structure

- Added App Router entrypoints under [`app`](/d:/ui/react_next/app)
- Converted route handling from React Router config arrays to file-based routes
- Added route files for:
  - admin auth pages
  - admin dashboard
  - users
  - modules
  - activity logs
  - client auth pages
  - client dashboard
  - error pages
- Added Next root layout in [`app/layout.jsx`](/d:/ui/react_next/app/layout.jsx)
- Added not found page in [`app/not-found.jsx`](/d:/ui/react_next/app/not-found.jsx)

## 3. Routing Replacement

- Removed dependency on `BrowserRouter`, `Routes`, and `Route`
- Replaced navigation flow with Next.js routing through the `app/` directory
- Added a compatibility shim in [`src/lib/react-router-dom.js`](/d:/ui/react_next/src/lib/react-router-dom.js) so existing page components could continue working during migration
- Preserved existing component logic by mapping old route targets into App Router `page.jsx` files

## 4. Provider Bootstrapping

- Added Next-specific app bootstrap/provider layer in [`components/providers/AppProviders.jsx`](/d:/ui/react_next/components/providers/AppProviders.jsx)
- Moved Redux store bootstrapping into the provider layer
- Moved auth initialization into client bootstrapping
- Registered Axios interceptors once at app startup
- Kept `react-hot-toast` global setup in the provider layer

## 5. Route Guards

- Added Next route wrapper components:
  - [`AdminPrivatePage.jsx`](/d:/ui/react_next/components/routing/AdminPrivatePage.jsx)
  - [`AdminPublicPage.jsx`](/d:/ui/react_next/components/routing/AdminPublicPage.jsx)
  - [`AdminProtectedPage.jsx`](/d:/ui/react_next/components/routing/AdminProtectedPage.jsx)
  - [`ClientPrivatePage.jsx`](/d:/ui/react_next/components/routing/ClientPrivatePage.jsx)
  - [`ClientPublicPage.jsx`](/d:/ui/react_next/components/routing/ClientPublicPage.jsx)
- Reused existing auth and permission guard components from `src/components`

## 6. Environment Variable Conversion

- Converted Vite env keys to Next public env keys in [`.env.development`](/d:/ui/react_next/.env.development)
- Applied:
  - `VITE_API_BASE_URL` -> `NEXT_PUBLIC_API_BASE_URL`
  - `VITE_ENV_NAME` -> `NEXT_PUBLIC_ENV_NAME`
  - `VITE_SITE_NAME` -> `NEXT_PUBLIC_SITE_NAME`
- Updated API client and footer components to use `process.env.NEXT_PUBLIC_*`

## 7. API Client and Service Layer

- Updated Axios base URL usage in [`http.jsx`](/d:/ui/react_next/src/utils/http.jsx)
- Made Axios interceptor registration idempotent in [`setupAxiosInterceptors.jsx`](/d:/ui/react_next/src/utils/setupAxiosInterceptors.jsx)
- Fixed service path issues where leading `/` could bypass `/api/` from the configured base URL
- Normalized affected service files:
  - [`moduleService.jsx`](/d:/ui/react_next/src/services/moduleService.jsx)
  - [`dashboardService.jsx`](/d:/ui/react_next/src/services/dashboardService.jsx)

## 8. Redux-Related Fixes

- Updated [`authSlice.jsx`](/d:/ui/react_next/src/redux/authSlice.jsx) to safely read browser storage in a Next environment
- Prevented server-side access to `localStorage`
- Fixed initial auth loading behavior for Next client bootstrapping
- Updated menu/access thunks to send auth headers directly from Redux state:
  - [`modulesSlice.jsx`](/d:/ui/react_next/src/redux/modulesSlice.jsx)
  - [`accessSlice.jsx`](/d:/ui/react_next/src/redux/accessSlice.jsx)
- Fixed admin layout logic so sidebar modules load when token exists even if `userUuid` is not yet resolved

## 9. Hydration and Client-Only Behavior Fixes

- Fixed hydration-sensitive logic in:
  - [`src/pages/admin/components/LayoutWrapper.jsx`](/d:/ui/react_next/src/pages/admin/components/LayoutWrapper.jsx)
  - [`src/pages/user/components/LayoutWrapper.jsx`](/d:/ui/react_next/src/pages/user/components/LayoutWrapper.jsx)
- Removed render-time `sessionStorage` reads
- Removed render-time `window.location.href` dependency
- Moved theme restoration to `useEffect`
- Added `suppressHydrationWarning` on `<html>` and `<body>` in [`app/layout.jsx`](/d:/ui/react_next/app/layout.jsx) to reduce false mismatches caused by browser extensions

## 10. Static Assets and Theme Assets

- Preserved existing images under `public/assets`
- Copied legacy CSS and font assets to:
  - [`public/assets/css`](/d:/ui/react_next/public/assets/css)
  - [`public/assets/fonts`](/d:/ui/react_next/public/assets/fonts)
- Stopped bundling legacy theme CSS through Next’s CSS module pipeline
- Loaded legacy global theme CSS via `<link>` tags from [`app/layout.jsx`](/d:/ui/react_next/app/layout.jsx)

## 11. UI Shell and Sidebar Fixes

- Updated admin sidebar logo link to Next route `/dashboard`
- Fixed left menu loading path so Redux-based module fetching is not blocked unnecessarily
- Preserved existing sidebar rendering behavior in [`Sidebar.jsx`](/d:/ui/react_next/src/pages/admin/components/Sidebar.jsx)

## 12. Framer Motion Compatibility

- Added local compatibility shim in [`src/lib/framer-motion.js`](/d:/ui/react_next/src/lib/framer-motion.js)
- Updated auth page imports to use the shim directly
- Filtered motion-only props like `whileHover`, `animate`, `initial`, and `transition` so they are not passed to raw DOM elements
- This keeps auth pages rendering without bundler/module resolution failures even when animation support is simplified

## 13. Cleanup of Unwanted Files

- Removed obsolete files not required in the Next.js setup:
  - Vite bootstrap files
  - old React Router config files
  - `src/App.css`
  - `src/assets/react.svg`
  - `public/vite.svg`
- Removed empty `src/routes` directory

## 14. Documentation Update

- Updated [`README.md`](/d:/ui/react_next/README.md) to reflect:
  - Next.js scripts
  - App Router structure
  - current environment keys
  - current route layout
  - migration notes

## 15. Manual Follow-Up Still Recommended

- Restart the Next dev server after env or webpack alias changes
- Revalidate all backend-connected pages against the actual API
- Review legacy vendor/theme files for lint noise and cleanup opportunities
- If full Framer Motion behavior is required, replace the shim with the real package path once the local environment resolves it cleanly
