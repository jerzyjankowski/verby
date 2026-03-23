# Verby Frontend Agent Guide

## Scope and stack
- Scope: `frontend/` only.
- Stack: React 19 + TypeScript + Vite + Tailwind CSS v4.
- UI is mobile-first; desktop is a progressive enhancement.

## Source of truth
- Theme tokens and custom utility patterns: `src/styles/globals.css`.
- Routes: file-based route builder in `src/routing/fileSystemRoutes.tsx`.
- Route path constants: `src/consts/urls.ts`.
- Domain models: `src/types/`.
- Persistent storage contracts: `src/utils/localStorage.ts`, `src/utils/library.ts`, `src/utils/settings.ts`.
- Localized UI strings: `src/locales/`.

## Folder conventions
- Pages: `src/pages/**/Page.tsx` (required naming).
- Optional page layouts: `src/pages/**/Layout.tsx` (must render `{children}`).
- Reusable UI wrappers: `src/components/shared/`.
- Lesson-specific UI: `src/components/lesson/`.
- Stateful page logic: hooks in `src/hooks/`.
- Pure/helpers and persistence code: `src/utils/`.
- Constants only: `src/consts/`.
- Types only: `src/types/`.

## Routing rules
- Do not hardcode route strings in components; use constants from `src/consts/urls.ts`.
- Add new pages by creating `Page.tsx` in `src/pages/...`; route registration is automatic.
- Keep global router setup in `src/App.tsx`; do not create alternate router entrypoints.
- Preserve `basename` handling in `src/App.tsx` for GitHub Pages compatibility.

## Shared component reuse (before creating new UI)
- First check `src/components/shared/` for:
  - `Button`, `Dropdown`, `TextField`, `TextArea`
  - `Sheet`, `Modal`
  - `Toast` (`ToastProvider`, `useToast`)
  - `ClampText`
- Prefer extending existing shared components via props/className over duplicating wrappers.
- For dialogs/sheets/menus/toasts, prefer existing Radix-based wrappers already in shared components.

## Styling and Tailwind
- Use theme token classes (`bg-primary`, `text-primary-text`, `border-primary-darkest`, etc.).
- Do not introduce hardcoded colors in JSX or ad-hoc CSS.
- If a new semantic color/spacing/z-index token is needed, add it in `src/styles/globals.css` first, then consume it.
- Prefer Tailwind utility classes over inline styles.
- Keep reusable card/surface patterns aligned with `.verby-card`.
- Keep layering consistent with existing z-index CSS vars (`--z-sticky`, `--z-dialog`, `--z-toast`, etc.).

## State, data, and persistence
- Keep storage read/write logic in `utils` modules; avoid direct `localStorage` usage in page components.
- Reuse existing lesson/library initialization and mutation helpers instead of duplicating algorithms.
- When updating persistence schema, keep backward compatibility with existing stored data whenever possible.

## Localization and copy
- User-facing text must come from `src/locales/` (`ui` and related maps), not inline literals.
- Add any new labels/messages in localization files and wire both languages where relevant.

## Dependencies and libraries
- Prefer current stack and existing deps; avoid adding new dependencies unless clearly justified.
- Existing UI primitives are based on Radix (`@radix-ui/*`), so keep that direction for consistency.
- Keep `react-router-dom` integration compatible with current file-based route generation.
- For utility operations, prefer existing `lodash` usage patterns already present in the codebase.

## Code quality patterns
- Keep components focused: view in page/component, orchestration in hooks, pure logic in utils.
- Avoid large monolithic components when behavior can be split into small private components.
- Use explicit TypeScript types from `src/types/` and keep new types colocated by domain.
- Follow existing naming style:
  - Components: `PascalCase`
  - Hooks/utils/constants: `camelCase`
  - Type aliases/interfaces: `PascalCase`

## Change safety checklist
- Reuse shared component first.
- Use route constants, not string literals.
- Use localized strings, not hardcoded UI text.
- Use theme tokens, not hardcoded colors.
- Keep persistence changes in utils and compatible with prior data.
- Verify the changed files compile/typecheck cleanly.
