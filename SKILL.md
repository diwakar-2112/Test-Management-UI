---
name: test-management-repo
description: Repository-specific guidance for updating the Test Management Portal Angular app. Use when working in this repo to make UI, routing, service, model, auth, theming, or feature updates without re-discovering project structure and conventions.
---

# Test Management Repo

Use this skill when changing code in this repository.

## Read This First

- Treat this as an Angular 20 standalone-component app.
- Preserve the existing `src/enviorments/*` and `enviorment` spelling. It is intentionally used throughout the repo even though it is misspelled.
- Expect a dirty worktree. Do not revert unrelated user changes.
- Prefer minimal, targeted edits over broad refactors.

## Tech Stack

- Angular 20 with standalone components and lazy `loadComponent` routes
- Zoneless change detection via `provideZonelessChangeDetection()`
- Signals for local UI state
- PrimeNG for dialogs, toast, inputs, and theme config
- Angular Material used selectively for icons
- Tailwind CSS with CSS variables in [`src/styles.css`](/d:/Test_Management_Portal/test-management/src/styles.css)

## Repo Map

- App bootstrap and providers: [`src/app/app.config.ts`](/d:/Test_Management_Portal/test-management/src/app/app.config.ts)
- Routes: [`src/app/app.routes.ts`](/d:/Test_Management_Portal/test-management/src/app/app.routes.ts)
- Layout shell: [`src/app/core/layout/main-layout/main-layout.component.ts`](/d:/Test_Management_Portal/test-management/src/app/core/layout/main-layout/main-layout.component.ts)
- Shared API wrapper: [`src/app/core/services/api.service.ts`](/d:/Test_Management_Portal/test-management/src/app/core/services/api.service.ts)
- Domain-oriented service layer: [`src/services/commonService.ts`](/d:/Test_Management_Portal/test-management/src/services/commonService.ts)
- Shared models: [`src/app/core/model/model.ts`](/d:/Test_Management_Portal/test-management/src/app/core/model/model.ts)
- Auth guard: [`src/app/core/authGuard/auth-guard.ts`](/d:/Test_Management_Portal/test-management/src/app/core/authGuard/auth-guard.ts)
- Auth interceptor: [`src/app/core/interceptors/auth.interceptor.ts`](/d:/Test_Management_Portal/test-management/src/app/core/interceptors/auth.interceptor.ts)
- Theme toggle logic: [`src/services/theme.service.ts`](/d:/Test_Management_Portal/test-management/src/services/theme.service.ts)
- Feature screens: `src/app/features/*`

## Working Pattern

- Read the target feature `.ts`, `.html`, and `.css` together before editing.
- For feature routes with params, expect component inputs declared with `input.required<string>()` and supplied by router component input binding.
- Keep feature-local state in signals and computed values unless the surrounding code already uses a different pattern.
- Use `ChangeDetectionStrategy.OnPush` when following existing feature/component style.
- Put raw HTTP concerns in `ApiService`; put business/domain calls in `CommonService`.
- Update interfaces in [`src/app/core/model/model.ts`](/d:/Test_Management_Portal/test-management/src/app/core/model/model.ts) when API response shapes change.

## UI Conventions

- Match the repo's current visual style instead of introducing a new design system.
- Reuse the semantic Tailwind color tokens: `bg-surface`, `text-text-main`, `border-border`, `bg-primary`, etc.
- Keep typography aligned with `Plus Jakarta Sans` from global styles.
- PrimeNG dialogs usually go through [`src/app/core/services/modal.service.ts`](/d:/Test_Management_Portal/test-management/src/app/core/services/modal.service.ts), often with an `ng-template` and `viewChild.required`.
- Toasts commonly use `MessageService` with `<p-toast />` rendered in the template.

## Routing And Data Flow

- Public entry route loads the login feature.
- Protected app content is nested under `MainLayoutComponent` with `authGuard`.
- Project flow is hierarchical:
  `projects` -> `projects/:projectId` -> `projects/:projectId/test-suites` -> `projects/:projectId/test-suites/:suiteId/test-cases`
- Global test runs are separate at `/test-runs`.

## Known Repo Quirks

- `CommonService` is the main integration point for backend endpoints even when methods are feature-specific.
- The backend response pattern commonly uses `{ content, pageInfo }`.
- Login stores `token` and `userName` in `localStorage`.
- The interceptor removes `token` and redirects on `401` or `403`.
- Dark mode is implemented by toggling the `dark` class on `<html>`.
- Some files contain formatting inconsistencies; preserve behavior first and normalize only when already touching the affected block.

## Update Checklist

- Confirm whether the change belongs in a feature component, shared service, shared model, or layout.
- If a new API field appears, update the model and any template bindings that render it.
- If a route changes, verify both [`src/app/app.routes.ts`](/d:/Test_Management_Portal/test-management/src/app/app.routes.ts) and any `router.navigate` or `routerLink` usages.
- If a modal flow changes, check open, submit, success toast, error toast, refresh, and close paths together.
- If theme-sensitive UI changes, inspect both light and dark token usage.

## Validation

- Run targeted checks first:
  - `npm run build`
  - `npm test`
- If editing a single feature, also inspect for template/type mismatches by reading the affected HTML with its component class.
- Pay extra attention to:
  - route param names
  - signal reads and writes
  - `localStorage` token behavior
  - backend payload property names

## Good Default Approach

1. Read the target feature and the related service/model files.
2. Make the smallest coherent patch.
3. Verify route wiring, payload shape, and template bindings.
4. Run the narrowest useful validation, then broaden only if needed.
