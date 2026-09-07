# ecosystem-web

Admin web frontend for the Ecosystem project.

## Tech stack

- React + TypeScript + Vite
- Ant Design (`antd`, `@ant-design/icons`)
- React Router
- TanStack Query — all server state
- Zustand — global client state only (auth session, layout)

## Getting started

```bash
npm install
npm run dev
```

Scripts: `npm run dev`, `npm run build`, `npm run preview`, `npm run lint`.

## Backend calls and the dev proxy

The app makes no API-base-URL configuration of its own. Every request is a
relative path — `/api/auth/...` for `ecosystem-auth`, `/api/accounts...` for
`ecosystem-accounts` — resolved against the current origin. In development,
`vite.config.ts` proxies those paths to the actual backend services:

```ts
server: {
  proxy: {
    '/api/auth': { target: 'http://localhost:8080', changeOrigin: true, rewrite: ... },
    '/api/accounts': { target: 'http://localhost:8081', changeOrigin: true, rewrite: ... },
  },
},
```

Adding a new backend service only requires one more proxy entry there. In
production, the same `/api/*` paths are expected to be routed by a reverse
proxy / API gateway in front of the built app.

## Structure

```text
src/
  api/        centralized client, error normalization, session refresh
  app/        App, providers, router
  layouts/    AuthLayout, AdminLayout, navigation definition
  features/
    auth/     api, components, hooks, pages, types
    accounts/ api, components, hooks, pages, types
  shared/     cross-feature components and utils
  stores/     authStore, layoutStore
  theme/      Ant Design tokens and spacing scale
```

## Routes

| Route | Layout | Access |
| --- | --- | --- |
| `/login` | `AuthLayout` | guests only |
| `/register` | `AuthLayout` | guests only |
| `/accounts` | `AdminLayout` | authenticated |
| `/accounts/:accountId` | `AdminLayout` | authenticated |

`/` redirects to `/accounts`. Unauthenticated visitors are sent to `/login` and
returned to their original destination after signing in.

## Authentication

On start the app calls `POST /api/auth/refresh` with `credentials: 'include'`
to restore a session from the refresh cookie. The access token lives only in
the Zustand auth store (memory), and the API client attaches it as a bearer
token.

A `401` on any authenticated request triggers a single shared refresh and one
retry, implemented centrally in `src/api/client.ts` and `src/api/session.ts`.
Features and components never implement refresh logic.

## Backend contracts

`ecosystem-auth` and `ecosystem-accounts` contracts are not final. All
assumptions are isolated in the feature `types/` and `api/` modules
(`features/*/types/index.ts`, `features/*/api/*.ts`) so they can be replaced
without touching UI components. HTTP errors are normalized into `ApiError`, and
field-level errors are rendered inside the matching Ant Design form fields.
