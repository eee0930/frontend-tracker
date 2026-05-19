# Code Style Guide

This document defines the frontend code style and engineering conventions for this project.

The goal is:
- consistency
- maintainability
- scalability
- readability
- production-quality architecture

---

# GENERAL PRINCIPLES

- Prefer readability over clever code
- Prefer explicit code over magic abstractions
- Keep components focused and small
- Avoid unnecessary complexity
- Optimize for maintainability

---

# FILE NAMING

## Components

Use PascalCase.

Examples:
- LoginForm.tsx
- UserCard.tsx
- HeaderNavigation.tsx

## Hooks

Use camelCase starting with "use".

Examples:
- useLoginMutation.ts
- useAuth.ts
- useUserProfile.ts

## Utilities

Use camelCase.

Examples:
- formatDate.ts
- createQueryKey.ts

## Types

Use descriptive names.

Examples:
- AuthResponse
- LoginPayload
- UserProfile

Avoid:
- Data
- Obj
- Item
- Temp

---

# COMPONENT RULES

## Prefer functional components

Use React functional components with TypeScript.

## One responsibility per component

Avoid giant components.

Bad:
- page handles fetching
- page handles form logic
- page handles modal logic
- page handles business logic

Good:
- separate hooks
- separate ui components
- separate api logic

## Keep JSX clean

Avoid large inline logic inside JSX.

Bad:

```tsx
{users.filter(...).map(...)}