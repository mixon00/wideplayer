# WidePlayer for X

WidePlayer for X is a browser extension project for making in-feed videos on X appear wider without switching to fullscreen.

This repository is now prepared as an initial commit scaffold:
- separate browser builds for Chrome, Firefox, and Safari
- Vite-powered build pipeline
- TypeScript source structure for content, settings, and background logic
- popup and options UIs for extension settings
- product documentation in `PRD.md`

## Current Status

The repository contains a runnable starter architecture, not the final feature-complete video expansion engine yet.

Included in this scaffold:
- browser-specific manifests
- TypeScript settings and storage layer
- content-script bootstrap for X and Twitter pages
- background service worker that initializes defaults
- popup and options pages for `autoEnable` and `widthPercent`
- Vite build pipeline that assembles per-browser distributions

## Planned Product Behavior

WidePlayer for X is designed to:
- enlarge videos beyond tweet width
- preserve feed layout and natural scrolling
- move the original player instead of duplicating it
- support automatic and manual activation modes
- stay configurable from extension settings

Product requirements are documented in `PRD.md`.

## Repository Structure

```text
/chrome
  manifest.json

/firefox
  manifest.json

/safari
  manifest.json

/src
  /background
  /content
  /options
  /popup
  /shared

/scripts
  build.mjs

tsconfig.json
```

Guiding rules:
- shared logic lives in `src/shared`
- browser folders own compatibility-specific manifests and future overrides
- build output is generated into `dist`

## Getting Started

Requirements:
- Node.js 18 or newer

Install the local project setup:

```bash
npm install
```

Build all browser distributions:

```bash
npm run build
```

Run TypeScript validation:

```bash
npm run typecheck
```

The build script generates:
- `dist/chrome`
- `dist/firefox`
- `dist/safari`

## Loading the Extension

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

- build output is scaffolded in `dist/safari`
- final Safari packaging will require Safari Web Extension tooling on macOS

## Settings

The starter UI already supports:
- `autoEnable`
- `widthPercent`

Current default values:
- `autoEnable: true`
- `widthPercent: 135`

## Available Scripts

```bash
npm run build
npm run clean
npm run typecheck
```

## Initial Commit Scope

This initial scaffold is intended to give the project a clean starting point for:
- browser-specific evolution
- storage and settings work
- content-script iteration
- overlay and player-move implementation
- Vite + TypeScript based development

## Documentation

- product requirements: `PRD.md`

## License

No license has been added yet.
