# WidePlayer for X and Mastodon

WidePlayer is a browser extension that makes supported in-feed videos on X and Mastodon appear wider without entering fullscreen.

The project is no longer just a scaffold. The current repository contains a working MVP with automatic and manual widening, an options-first settings flow, per-platform width controls, a small popup shortcut, browser-specific build outputs for Chrome, Firefox, and Safari, and release ZIP packaging for the generated builds.

## Current Status

As of version `1.0.3`, the project ships a functional extension MVP with these behaviors:

- detects supported in-feed videos on `x.com`, Mastodon instances, and Mastodon YouTube embeds
- moves the original player into a fixed overlay instead of duplicating the video element
- preserves feed flow with a placeholder while the player is expanded
- supports automatic mode and manual per-video expand/collapse controls
- uses icon-based manual controls with a top fade that appear on hover or focus, fade back out after about 2 seconds of pointer inactivity, and stay visible while the video is paused
- horizontally centers expanded videos in the viewport instead of keeping them anchored to the original in-feed box
- uses a small popup shortcut for page status and access to full settings
- uses a tabbed options page for Settings, About, Help, and release-note style content
- previews width changes live while the slider is being dragged and saves the final value on release
- keeps the widened overlay below the sticky top bar while still allowing it to cover side columns
- builds separate distributions for Chrome, Firefox, and Safari

## What Works Today

### Video behavior

- Auto mode is enabled by default
- Manual mode adds icon-based `Expand` / `Collapse` controls to supported players
- Clicking outside an expanded manual player collapses it just like pressing the `Collapse` button
- Manually expanded players automatically scroll into the vertical center of the viewport
- Manual controls stay hidden until the pointer is over the player or the control receives focus, then fade back out after about 2 seconds without pointer movement unless the video is paused
- Expanded videos shift toward the horizontal center of the viewport as they widen
- Expanded width is constrained by viewport width, viewport height, and the user-selected width setting
- While visible, the expanded player is continuously repositioned on scroll and resize
- The current implementation scales the widened player with viewport position: it starts near the original size when entering the screen, reaches the configured target size near the viewport center, and shrinks again while leaving the screen

### Settings

The extension exposes these settings in the options page:

- `autoEnableX`
- `autoEnableMastodon`
- `widthPercentX`
- `widthPercentMastodon`

Current defaults:

- `autoEnableX: true`
- `autoEnableMastodon: true`
- supported platform width values default to `35`

The options page is the primary settings surface. The popup only shows page status, an `Open settings` button, and the build version.

The extension UI shares the same visual design tokens, rounded card treatment, and light color palette so it feels consistent with the marketing site.

Width changes now behave in two phases:

- realtime preview during slider drag is broadcast immediately for active players
- final persisted value is saved when the slider change is committed

### Stability and cleanup

- candidate detection re-runs on feed mutations
- active overlays are restored back into the feed item when the player is collapsed
- cleanup paths handle disconnects, navigation changes, and removed nodes
- the widened overlay stays under X's sticky top bar while still rendering above the side columns
- if the enhancement cannot be applied, the original in-feed player remains usable

## Current Limitations

- detection currently targets X tweet articles and Mastodon statuses that contain exactly one direct video or supported YouTube embed
- media galleries, unusual nested layouts, or unsupported embed structures may be ignored
- Safari output is generated, but final Safari packaging still depends on Safari Web Extension tooling on macOS
- there is no dedicated automated test suite yet; validation is currently done through `npm run typecheck` and `npm run build`

## Repository Structure

```text
/chrome
  manifest.json

/firefox
  manifest.json

/safari
  manifest.json

/scripts
  package-release.mjs
  prepare-build.mjs

/src
  /background
  /content
  /options
  /popup
  /shared
```

Guiding rules:

- shared logic lives in `src/shared`
- browser folders only contain browser-specific manifest and compatibility differences
- generated files in `dist` should not be edited by hand

## Development

Requirements:

- Node.js 18 or newer

Install dependencies:

```bash
npm install
```

Build every browser target:

```bash
npm run build
```

Build only one target:

```bash
npm run build:chrome
npm run build:firefox
npm run build:safari
```

Package release ZIPs:

```bash
npm run package:release
```

Or package a single browser build:

```bash
npm run package:chrome
npm run package:firefox
npm run package:safari
```

Run type checking:

```bash
npm run typecheck
```

Clean generated output:

```bash
npm run clean
```

Start the Chrome-focused watch flow:

```bash
npm run dev:chrome
```

The build generates:

- `dist/chrome`
- `dist/firefox`
- `dist/safari`

Release packaging generates:

- `release/wideplayer-for-x-<version>-chrome.zip`
- `release/wideplayer-for-x-<version>-firefox.zip`
- `release/wideplayer-for-x-<version>-safari.zip`

Each build also receives a generated build id stored in `.wideplayer-build.json` and shown in the popup and options UI.
Release ZIPs preserve the built directory layout and omit sourcemaps and source artwork that are not needed for distribution.

## Loading The Extension

### Chrome

- open `chrome://extensions`
- enable Developer mode
- choose Load unpacked
- select `dist/chrome`

### Firefox

- open `about:debugging#/runtime/this-firefox`
- choose Load Temporary Add-on
- select `dist/firefox/manifest.json`

### Safari

- generated output is available in `dist/safari`
- final packaging and local installation still require Safari Web Extension tooling on macOS

## Documentation

- product requirements and current MVP scope: `PRD.md`
- release notes: `CHANGELOG.md`

## License

No license has been added yet.
