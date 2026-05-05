# Contributing

Thanks for your interest in contributing to WidePlayer.

This repository contains the WidePlayer landing site and the WidePlayer for X browser extension. Keep changes focused and match the existing lightweight TypeScript architecture.

## Setup

Requirements:

- Node.js 18 or newer
- npm

Install dependencies from the repository root:

```bash
npm install
```

## Development

Run the landing site:

```bash
npm run dev:web
```

Run the Chrome-focused extension watch flow:

```bash
npm run dev:extension
```

Build all workspaces:

```bash
npm run build
```

Type-check the extension:

```bash
npm run typecheck:extension
```

## Pull Requests

Before opening a pull request:

- keep the PR focused on one fix, feature, or documentation update
- include a clear description of the user-facing behavior or developer-facing change
- run the relevant validation commands
- mention any manual browser testing you performed
- avoid committing generated output such as `dist`, `.next`, `node_modules`, or release ZIPs

## Extension Guidelines

- Keep shared extension logic in `apps/extension/src/shared`.
- Use browser-specific folders only for manifest or compatibility differences.
- Treat Chrome as the baseline unless another browser requires an override.
- Preserve the moved-player overlay architecture unless the change intentionally updates that design.
- If an enhancement cannot be applied, the original in-feed X player should remain usable.

## Documentation

Update documentation in the same PR when behavior changes.

Common places to check:

- `README.md` for repository-level setup and public project information
- `apps/extension/README.md` for extension implementation and loading details
- `apps/extension/CHANGELOG.md` for user-facing release notes
- `apps/extension/PRD.md` for current product scope and constraints

## Reporting Bugs

Use the bug report issue template and include:

- browser and version
- operating system
- WidePlayer version or build
- clear reproduction steps
- expected and actual behavior
- screenshots or screen recordings when useful
