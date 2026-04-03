# WidePlayer for X

WidePlayer for X is a browser extension that makes supported in-feed videos on X appear wider without entering fullscreen.

The project is no longer just a scaffold. The current repository contains a working MVP with automatic and manual widening, synchronized settings surfaces, and browser-specific build outputs for Chrome, Firefox, and Safari.

## Current Status

As of version `0.3.2`, the project ships a functional extension MVP with these behaviors:

- detects supported in-feed videos on `x.com` and `twitter.com`
- moves the original player into a fixed overlay instead of duplicating the video element
- preserves feed flow with a placeholder while the player is expanded
- supports automatic mode and manual per-video expand/collapse controls
- keeps popup and options settings synchronized through extension storage
- builds separate distributions for Chrome, Firefox, and Safari

## What Works Today

### Video behavior

- Auto mode is enabled by default
- Manual mode adds an `Expand` / `Collapse` button to supported players
- Expanded width is constrained by viewport width, viewport height, and the user-selected width setting
- While visible, the expanded player is continuously repositioned on scroll and resize
- The current implementation scales the widened player with viewport position: it starts near the original size when entering the screen, reaches the configured target size near the viewport center, and shrinks again while leaving the screen

### Settings

The extension currently exposes two settings:

- `autoEnable`
- `widthPercent`

Current defaults:

- `autoEnable: true`
- `widthPercent: 35`

Both popup and options pages read from the same storage layer and stay aligned through shared UI logic in `src/shared`.

### Stability and cleanup

- candidate detection re-runs on feed mutations
- active overlays are restored back into the tweet when the player is collapsed
- cleanup paths handle disconnects, navigation changes, and removed nodes
- if the enhancement cannot be applied, the original in-feed player remains usable

## Current Limitations

- detection currently targets tweet articles that contain exactly one direct video candidate
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

Each build also receives a generated build id stored in `.wideplayer-build.json` and shown in the popup and options UI.

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
