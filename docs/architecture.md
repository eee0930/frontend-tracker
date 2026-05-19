# Architecture

## Folder Strategy

Use feature-based architecture.

Example:
src/features/auth
src/features/user
src/features/home

Each feature contains:
- api
- components
- hooks
- store
- types

## State Strategy

- Server state → React Query
- UI state → local state
- Shared client state → Zustand

## Auth Strategy

- Access token stored in memory
- Refresh token handled securely
- Axios interceptors handle refresh flow