# AGENTS.md

## Project Summary

WidePlayer for X is a Vite + TypeScript browser extension scaffold that makes in-feed X videos appear wider without fullscreen. The current repository is an early scaffold, not the final feature-complete implementation. Treat `PRD.md` as the source of truth for intended product behavior.

## Stack And Commands

- Node.js 18+
- `npm install` to install dependencies
- `npm run typecheck` to validate TypeScript
- `npm run build` to generate `dist/chrome`, `dist/firefox`, and `dist/safari`
- `npm run clean` to remove generated build output

## Repository Layout

- `src/content` contains the content script entrypoint and DOM behavior for X/Twitter pages
- `src/background` contains the background service worker entrypoint
- `src/shared` contains browser API access, storage, settings, constants, and shared UI logic
- `src/popup` and `src/options` contain the two extension settings surfaces
- `chrome`, `firefox`, and `safari` contain browser-specific manifests and future overrides
- `scripts/build.mjs` builds shared assets first, then copies browser-specific files into each distribution target
- `dist` is generated output and should never be edited by hand

## Working Rules

- Keep shared logic in `src/shared`; use browser folders only for compatibility-specific differences
- Treat Chrome as the baseline build unless a browser requires a specific override
- Preserve the current lightweight, framework-free TypeScript architecture
- Prefer existing abstractions in `src/shared/browser-api.ts`, `src/shared/storage.ts`, and `src/shared/settings.ts` over scattering raw browser API calls
- When changing settings, keep defaults, normalization, persistence, popup UI, and options UI aligned
- When changing content-script behavior, make DOM updates idempotent and resilient to frequent X feed rerenders
- Keep cleanup paths working for disconnects, navigation changes, and removed tweet nodes
- Do not edit generated files under `dist`

## Product Constraints

- The intended implementation moves the original player instead of duplicating the video element
- Auto mode is the default behavior; manual mode should rely on per-video controls
- Preserve feed layout and natural scrolling while the video is enlarged
- Fail safely: if enhancement logic cannot be applied, the original in-feed player should remain usable

## Validation Expectations

- Run `npm run typecheck` after changing TypeScript, HTML, or shared UI wiring
- Run `npm run build` after changing manifests, build logic, or extension entrypoints
- If changing settings behavior, verify both popup and options surfaces stay in sync
- There is no dedicated test suite yet; do not add new tooling unless the task requires it
