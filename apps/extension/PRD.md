# WidePlayer for X and Mastodon — Product Requirements Document

## 1. Document Purpose

This PRD is the source of truth for both:

- the current shipped MVP behavior
- the intended product direction for upcoming iterations

The repository is no longer a blank scaffold. As of version `1.1.0`, it contains a working browser extension with a real in-feed widening flow for supported X and Mastodon videos. Bluesky support is in progress, but not shipped in the extension yet.

---

## 2. Product Goal

Build a browser extension for X and Mastodon that enlarges supported in-feed videos without entering fullscreen.

Core principles:

- preserve feed layout
- preserve natural scrolling
- move the original player instead of duplicating the video element
- keep the experience configurable through extension settings
- fail safely when enhancement cannot be applied

---

## 3. Current MVP State

### 3.1 Implemented today

The current project already implements:

- support for `x.com`
- support for Mastodon instances detected from Mastodon page metadata or the Mastodon app root
- support for Mastodon YouTube embeds
- automatic enlargement mode enabled by default
- manual mode with per-video icon-based `Expand` / `Collapse` controls
- manual controls with a top fade overlay that appear on hover or focus, fade away again after about 2 seconds of pointer inactivity, and stay visible while the video is paused
- storage-backed settings managed from the options page
- a popup with quick on/off toggles for supported platforms, page status, build version, and access to full settings
- a tabbed options page for Settings, About, Help, and recent changes
- realtime width preview during slider drag, with final persistence when the slider change is committed
- a player-move overlay architecture that mounts the original player into a fixed overlay
- placeholder-based layout preservation while a player is widened
- expanded videos shift toward the horizontal center of the viewport instead of staying anchored to the original in-feed box
- scroll and resize synchronization for active overlays
- overlay layering that keeps the widened player below X's sticky top bar while still allowing it to render above the side columns
- viewport-aware sizing that grows a visible player toward its configured width near the center of the screen and reduces it again toward entry and exit
- cleanup logic for rerenders, disconnects, navigation changes, and removed tweet nodes
- separate build outputs for Chrome, Firefox, and Safari
- release ZIP archives generated from the built Chrome, Firefox, and Safari outputs

### 3.2 Current limitations

The MVP is intentionally narrower than the final product vision.

Known limitations:

- detection currently targets X tweet articles and Mastodon statuses with exactly one direct video or supported YouTube embed
- unusual embed structures, galleries, or unsupported DOM layouts may be skipped
- browser-specific behavior is mostly shared; platform divergences are not deeply optimized yet
- there is no dedicated test suite yet
- Safari output and release ZIPs can be generated here, but final Safari packaging still depends on Safari tooling outside this repository

---

## 4. Supported Modes

### 4.1 Auto Mode

Status: implemented

Behavior:

- enabled by default
- supported videos activate automatically when their tweet becomes visible in the viewport
- widened player size is constrained by viewport width, viewport height, and user settings
- while the tweet moves through the viewport, the visible player grows from near-original size, reaches its target near the viewport center, then shrinks again while leaving the screen
- no user click is required

### 4.2 Manual Mode

Status: implemented

Behavior:

- used when the current platform's auto mode is disabled
- injects a per-video icon button into supported players
- the control appears while the player is hovered or focused, then hides again after a short idle period without pointer movement unless the video is paused
- button toggles between `Expand` and `Collapse`
- clicking outside an expanded manual player collapses it the same way as pressing `Collapse`
- expanding a manual player scrolls the page so the widened player lands near the vertical center of the viewport
- uses the same moved-player overlay architecture as auto mode

---

## 5. Current Functional Requirements

### 5.1 Candidate detection

The content script must:

- scan X feed articles and Mastodon statuses for supported video candidates
- avoid duplicating candidates for the same article
- ignore unsupported layouts instead of forcing enhancement
- remain resilient to frequent feed rerenders

### 5.2 Player enlargement

When a candidate activates, the extension must:

- move the original player into an overlay frame
- preserve the tweet flow with a placeholder of matching height
- keep the overlay aligned with the tweet as the page scrolls
- keep widened videos horizontally centered in the viewport even when the in-feed player starts from a narrower box
- clamp widened size so it stays usable inside the viewport
- keep the widened player below the sticky top bar while still rendering above the side columns
- restore the original player cleanly when the candidate deactivates

### 5.3 Settings

The extension must keep these values aligned across options, storage, and runtime behavior:

- `autoEnableX`
- `autoEnableMastodon`
- `platformEnabledX`
- `platformEnabledMastodon`
- `widthPercentX`
- `widthPercentMastodon`

Current defaults:

- `autoEnableX: true`
- `autoEnableMastodon: true`
- `platformEnabledX: true`
- `platformEnabledMastodon: true`
- supported platform width values default to `35`

Settings behavior requirements:

- slider drag should update active players in realtime
- final width should persist only after the user commits the slider change
- realtime preview should not require a page reload

### 5.4 Options page

The extension should provide an options page that:

- uses tabs for Settings, About, Help, and What's new
- lets supported platforms be enabled or disabled from options and the popup
- lets each supported platform have its own Auto mode and width setting
- shows unsupported platforms as Coming soon cards without active controls
- explains what WidePlayer does in a short About section
- answers the core usage and limitation questions in a concise FAQ
- shows a plain-language changelog in the What’s new tab, grouped by the same versions as `CHANGELOG.md`
- stays aligned with `CHANGELOG.md` whenever release notes change

### 5.5 Fail-safe behavior

If enhancement cannot be safely applied, the extension must:

- leave the original in-feed player usable
- avoid leaving detached overlays behind
- avoid breaking feed layout

---

## 6. UX Constraints

The experience must continue to honor these constraints:

- widening should feel like an enhancement of the feed, not a fullscreen takeover
- tweet layout should remain understandable while the player is expanded
- scrolling should remain natural
- the widened player should not feel detached from its originating tweet
- manual controls should stay obvious but lightweight
- width controls should feel immediate while adjusting settings

---

## 7. Technical Constraints

Implementation rules for the current architecture:

- shared logic belongs in `src/shared`
- browser folders should contain only compatibility-specific differences
- Chrome remains the baseline build unless a browser requires an override
- content-script DOM mutations must be idempotent
- cleanup paths must continue working when nodes disconnect or the feed rerenders
- generated output in `dist` must never be edited manually
- do not change the moved-player mounting approach unless explicitly requested

---

## 8. Non-Goals For The Current MVP

The current MVP does not yet aim to deliver:

- universal support for every X media layout
- browser-specific feature forks beyond manifest-level differences
- a dedicated automated test harness
- browser-store listing assets, submission automation, or notarization workflows
- a fully custom icon font pipeline or bundled webfont set for every extension surface

---

## 9. Near-Term Product Direction

The next iterations should focus on:

- improving support coverage for more X media layouts
- extending the shared visual system to any future onboarding, help, or release-note surfaces inside the extension
- tuning manual controls and per-video affordances
- validating browser-specific quirks where Chrome, Firefox, and Safari diverge
- adding stronger validation around DOM behavior and settings synchronization
- continuing Bluesky support work without exposing active controls before it ships

---

## 10. Acceptance Snapshot For The Current State

The current MVP should be considered healthy when:

- `npm run typecheck` passes after TypeScript or UI wiring changes
- `npm run build` produces working outputs in `dist/chrome`, `dist/firefox`, and `dist/safari`
- `npm run package:release` produces ZIP archives in `release` for the built browser targets
- popup shows quick platform toggles, page status, build version, and opens options
- options controls platform-specific auto mode and width settings
- width changes preview live without reloading the page
- supported videos can widen and restore without breaking the surrounding feed
