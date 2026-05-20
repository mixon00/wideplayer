# WidePlayer

WidePlayer is a browser extension that makes supported in-feed videos on X and Mastodon appear wider without entering fullscreen. This repository also contains the public landing site for the project.

The extension is built for people who watch video-heavy feeds and want a larger player while keeping the feed context, scrolling behavior, and native video controls intact.

## What Is In This Repository

```text
apps/
  extension/  Browser extension for Chrome, Firefox, and Safari builds
  web/        Next.js landing site deployed with OpenNext for Cloudflare
```

This is an npm workspaces monorepo. The root package is private and only coordinates workspace commands.

## Current Extension Status

WidePlayer currently:

- widens supported in-feed videos on `x.com`, Mastodon instances, and Mastodon YouTube embeds
- moves the original player into a wider overlay instead of duplicating the video element
- preserves feed flow with a placeholder while the player is expanded
- supports automatic widening and manual per-video expand/collapse controls
- provides quick popup toggles for supported platforms
- uses the options page for per-platform auto mode and width settings
- previews width changes live while an options slider is dragged
- builds browser-specific outputs for Chrome, Firefox, and Safari

Current limitations:

- detection targets X tweet articles and Mastodon statuses with one direct video or supported YouTube embed
- media galleries, unusual nested layouts, and unsupported embeds may be skipped
- Bluesky support is in progress, but not shipped in the extension yet
- LinkedIn support is planned
- Safari output can be generated here, but final Safari packaging still depends on Safari Web Extension tooling on macOS
- there is no dedicated automated test suite yet

For deeper extension implementation details, see [apps/extension/README.md](apps/extension/README.md).

## Requirements

- Node.js 18 or newer
- npm

## Getting Started

Install dependencies from the repository root:

```bash
npm install
```

Run the landing site locally:

```bash
npm run dev:web
```

Run the Chrome-focused extension watch flow:

```bash
npm run dev:extension
```

## Build And Validation

Build everything:

```bash
npm run build
```

Build one workspace:

```bash
npm run build:web
npm run build:extension
```

Type-check the extension:

```bash
npm run typecheck:extension
```

The extension build generates:

- `apps/extension/dist/chrome`
- `apps/extension/dist/firefox`
- `apps/extension/dist/safari`

Generated output should not be edited by hand.

## Packaging Extension Releases

Package every browser target:

```bash
npm run package:release --workspace apps/extension
```

Package one browser target:

```bash
npm run package:chrome --workspace apps/extension
npm run package:firefox --workspace apps/extension
npm run package:safari --workspace apps/extension
```

Release ZIPs are written to `apps/extension/release`.

## Loading The Extension Locally

First build the extension:

```bash
npm run build:extension
```

Chrome:

1. Open `chrome://extensions`.
2. Enable Developer mode.
3. Choose Load unpacked.
4. Select `apps/extension/dist/chrome`.

Firefox:

1. Open `about:debugging#/runtime/this-firefox`.
2. Choose Load Temporary Add-on.
3. Select `apps/extension/dist/firefox/manifest.json`.

Safari:

1. Build output is generated in `apps/extension/dist/safari`.
2. Use Safari Web Extension tooling on macOS for final local installation or packaging.

## Privacy

The WidePlayer extension does not collect user data.

The landing site uses cookieless Umami analytics for anonymous page traffic. This is separate from the browser extension.

## Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

When changing extension behavior, keep the detailed extension docs in [apps/extension/README.md](apps/extension/README.md), [apps/extension/CHANGELOG.md](apps/extension/CHANGELOG.md), and [apps/extension/PRD.md](apps/extension/PRD.md) aligned with the current state.

## Security

Please report security issues privately. See [SECURITY.md](SECURITY.md).

## License

WidePlayer is released under the [MIT License](LICENSE).
