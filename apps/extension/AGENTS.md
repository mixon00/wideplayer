# AGENTS.md

## Project Summary

WidePlayer is a Vite + TypeScript browser extension that makes supported in-feed videos on X and Mastodon appear wider without entering fullscreen.

The repository currently contains a working MVP, not just a scaffold. As of version `1.0.3`, the extension:

- supports `x.com`
- supports Mastodon instances
- supports Mastodon YouTube embeds
- detects supported in-feed video candidates
- moves the original player into a fixed overlay instead of duplicating the video element
- preserves feed layout with a placeholder while the player is expanded
- supports automatic mode and manual per-video controls
- uses icon-based manual controls that appear on player hover or focus, fade away again after about 2 seconds of pointer inactivity, and stay visible while the video is paused
- collapses manually expanded players when the user clicks outside them
- scrolls manually expanded players toward the vertical center of the viewport while opening
- keeps popup and options settings synchronized through extension storage
- previews width changes live while the settings slider is being dragged and persists the final value when the change is committed
- uses the popup as the primary settings surface and the options page for About & Help content
- keeps the widened overlay below X's sticky top bar while still rendering above the side columns
- shifts expanded videos toward the horizontal center of the viewport instead of anchoring them to the original in-feed box
- builds separate distributions for Chrome, Firefox, and Safari
- can package browser-specific release ZIPs from built output

Treat `PRD.md` as the source of truth for current product scope and near-term direction, but keep `README.md`, `CHANGELOG.md`, and `AGENTS.md` aligned with the actual repository state.

## Stack And Commands

- Node.js 18+
- `npm install` to install dependencies
- `npm run typecheck` to validate TypeScript
- `npm run build` to generate `dist/chrome`, `dist/firefox`, and `dist/safari`
- `npm run build:chrome`, `npm run build:firefox`, `npm run build:safari` to build individual targets
- `npm run package:release` to generate browser-specific ZIP archives in `release`
- `npm run package:chrome`, `npm run package:firefox`, `npm run package:safari` to package individual targets
- `npm run dev:chrome` to run the Chrome-focused watch flow
- `npm run clean` to remove generated build output

## Repository Layout

- `src/content` contains the content script entrypoint, detection logic, overlay positioning, and player-move behavior for X/Twitter and Mastodon pages
- `src/background` contains the background service worker entrypoint that ensures default settings exist
- `src/shared` contains browser API access, storage, settings normalization, live preview state, constants, build info, and shared UI logic
- `src/popup` and `src/options` contain the two settings surfaces
- `chrome`, `firefox`, and `safari` contain browser-specific manifests and compatibility overrides
- `scripts/prepare-build.mjs` generates the build id used by popup/options and prepares build metadata
- `scripts/package-release.mjs` packages built browser outputs into release ZIP archives
- `README.md` describes the current developer-facing state of the project
- `CHANGELOG.md` contains user-facing release notes
- `PRD.md` tracks current MVP scope, constraints, and near-term direction
- `dist` is generated output and should never be edited by hand

## Current Product Constraints

- The implementation moves the original player instead of duplicating the video element
- Auto mode is the default behavior
- Manual mode relies on per-video controls when `autoEnable = false`
- Preserve feed layout and natural scrolling while the video is enlarged
- Keep DOM updates idempotent and resilient to frequent X feed rerenders
- Keep cleanup paths working for disconnects, navigation changes, and removed tweet nodes
- Fail safely: if enhancement logic cannot be applied, the original in-feed player should remain usable
- Width changes from settings should feel immediate without requiring a page reload

## Working Rules

- Keep shared logic in `src/shared`; use browser folders only for compatibility-specific differences
- Treat Chrome as the baseline build unless a browser requires a specific override
- Preserve the current lightweight, framework-free TypeScript architecture
- Do not change `package.json` metadata such as `description`, `name`, or unrelated fields unless the user explicitly asks for it
- Prefer existing abstractions in `src/shared/browser-api.ts`, `src/shared/storage.ts`, and `src/shared/settings.ts` over scattering raw browser API calls
- When changing settings, keep defaults, normalization, persistence, popup UI, and options UI aligned
- When changing content-script behavior, preserve the moved-player overlay architecture unless the user explicitly asks for an architectural change
- Do not edit generated files under `dist`

## Documentation Rules

- Keep `README.md`, `CHANGELOG.md`, `PRD.md`, and `AGENTS.md` aligned with the current project state
- When behavior changes materially, update the relevant documentation in the same task unless the user says otherwise
- On every version bump, also update:
  - `README.md`
  - `CHANGELOG.md`
  - `PRD.md`
- After a version bump and the required documentation updates, propose a commit message for the current set of changes without mentioning the version bump itself unless the user explicitly asks for that
- Proposed commit messages must use the repository's existing prefix style such as `fix:`, `feat:`, `feat(ui):`, or `release:`, chosen to match the dominant change
- If a version bump changes shipped behavior, make sure the changelog entry is user-facing and the README/PRD describe the new current state accurately

## Validation Expectations

- Run `npm run typecheck` after changing TypeScript, HTML, or shared UI wiring
- Run `npm run build` after changing manifests, build logic, or extension entrypoints
- If changing settings behavior, verify both popup and options surfaces stay in sync
- There is no dedicated test suite yet; do not add new tooling unless the task requires it
