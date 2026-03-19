# Next.js Admin UI

Next.js App Router migration of the admin/client UI for authentication, role-based access control, activity logs, modules, and user management.

## Stack

- Next.js 15
- React 19
- App Router (`/app`)
- Redux Toolkit
- React Bootstrap + Bootstrap 5
- React Hook Form
- Axios
- i18next

## Requirements

- Node.js 18+
- npm 9+
- Backend API running locally or in your target environment

## Environment

This project uses `.env.development`.

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8020/api/
NEXT_PUBLIC_ENV_NAME=development
NEXT_PUBLIC_SITE_NAME=NACK
```

## Scripts

```bash
npm install
npm run dev
npm run build
npm run start
```

## Routing

The application now uses Next.js file-based routing under `app/`.

Main admin routes:

- `/`
- `/dashboard`
- `/login`
- `/register`
- `/forgot-password`
- `/reset-password`
- `/register-success`
- `/user`
- `/user/create`
- `/user/edit/[uuid]`
- `/user/view/[uuid]`
- `/user/profile/[uuid]`
- `/module`
- `/module/[uuid]`
- `/module/create`
- `/module/edit/[uuid]`
- `/module/view/[uuid]`
- `/module/permission`
- `/module/permission/[uuid]`
- `/module/permission/role`
- `/activity-logs`
- `/forbidden`
- `/server_error`

Client routes:

- `/client/login`
- `/client/register`
- `/client/forgot-password`
- `/client/reset-password`
- `/client/register-success`
- `/client/dashboard`

## Structure

```text
app/                  # Next.js App Router entrypoints
components/           # Next-specific providers and route wrappers
public/assets/        # served CSS, fonts, images, and theme assets
src/
  components/         # shared UI and guard components
  hooks/              # shared hooks
  lib/                # Next-compatible router shim
  pages/              # migrated page components reused by app/
  redux/              # store and slices
  services/           # API service layer
  utils/              # http client, helpers, interceptors
```

## Notes

- The old Vite bootstrap files and React Router route config files were removed.
- Legacy theme CSS and fonts are served from `public/assets` instead of being bundled through Next.
- Navigation compatibility for existing page components is handled in `src/lib/react-router-dom.js`.
- Auth state still uses Redux plus browser storage, but bootstrapping now runs through the Next provider layer.
# next-rbac-management-ui
