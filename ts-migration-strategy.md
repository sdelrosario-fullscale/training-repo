# TypeScript Migration Strategy

## Goal

Move an untyped React Native codebase to strict TypeScript without stopping feature delivery or attempting a single large rewrite. Every merged change should either preserve or improve type safety.

## Target compiler settings

The target configuration extends the React Native TypeScript defaults and enables:

- `strict: true` for null safety, function variance, property initialization, and other strict checks.
- `noUncheckedIndexedAccess: true` so array and record lookups include `undefined` until checked.
- `exactOptionalPropertyTypes: true` so an omitted property is different from a property explicitly set to `undefined`.

Keep `allowJs: true` and `checkJs: false` during the migration. Existing JavaScript continues to build, while every converted `.ts` or `.tsx` file is checked against the strict target.

## Migration principles

1. **Protect the baseline.** Run `tsc --noEmit` in CI and reject new TypeScript errors. Record the existing JavaScript file count and reduce it over time.
2. **Type boundaries before internals.** Start with API payloads, storage, navigation parameters, and native-module adapters. Treat external data as `unknown` until it is parsed or narrowed.
3. **Convert in vertical slices.** Migrate one feature path at a time: domain models, API function, store, hook, leaf components, then its screen. Keep each pull request small enough to review and revert.
4. **Prefer narrowing over assertions.** Use discriminated unions, type guards, and exhaustive switches. Avoid `any`; use a documented `@ts-expect-error` only as a temporary exception with a follow-up owner.
5. **Do not mix migration with redesign.** Preserve behavior first, add characterization tests where behavior is unclear, and refactor only after the converted slice passes tests.

## Recommended sequence

### Phase 1: Establish guardrails

- Add the strict target flags to `tsconfig.json`.
- Add `typecheck` to local validation and CI.
- Publish shared conventions for nulls, optional properties, error handling, and temporary exceptions.
- Track migration by feature or directory rather than by a single repository-wide deadline.

### Phase 2: Define boundary types

- Model API resources and request bodies with named types.
- Return `ApiResult<T>` from network calls so success, HTTP, network, and decode outcomes are explicit.
- Parse persisted and remote data at the boundary; do not spread unchecked values through components.
- Type navigation route parameters and native-module interfaces early because many screens depend on them.

### Phase 3: Convert feature slices

For each active feature:

1. Add or confirm behavior-focused tests.
2. Convert utilities and models with few dependencies.
3. Convert the API and Zustand store.
4. Convert React Query hooks and reusable components.
5. Convert the screen and remove temporary compatibility types.
6. Run type checking, linting, formatting, and tests before opening the pull request.

Choose files already being changed for product work when practical. This keeps migration cost close to the code receiving value and avoids a long-lived migration branch.

### Phase 4: Tighten and finish

- Review remaining JavaScript, assertions, suppressions, and `unknown` values on a regular cadence.
- Fail CI if the JavaScript file count or approved suppression count increases.
- Turn on `checkJs` for any JavaScript directories that cannot yet be converted.
- Remove `allowJs` only after the last JavaScript source file is migrated.

## Pull request size and review

A migration pull request should cover one coherent feature slice, preserve behavior, and include its tests. The reviewer should be able to verify the runtime behavior and the type boundary independently. Large mechanical renames or formatting changes should be separate from semantic typing changes.

## Progress measures

Track a small set of trend metrics:

- JavaScript source files remaining.
- TypeScript source files passing strict checks.
- Temporary `@ts-expect-error` comments, each with an owner and removal issue.
- Feature slices fully typed from API boundary to screen.
- Escaped `any` usage, with a target of zero in migrated code.

The migration is complete when application source is TypeScript, strict validation passes without unowned suppressions, external data is narrowed at its boundaries, and the CI quality gate prevents regression.
