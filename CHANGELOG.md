# Changelog

## 0.3.11 - 2026-04-09

### Improved

- Popup and the About & Help page now use the landing page visual palette with cream surfaces, earth-green accents, bright-green highlights, and bronze eyebrow styling.
- The popup is now the primary place for quick settings, while the options page now works as a lightweight About & Help screen with FAQ and recent updates.
- Extension copy now refers only to `x.com` in user-facing text.
- Extension icons were refreshed from the latest source artwork.
- Project metadata now reflects `0.3.11` across `package.json`, `package-lock.json`, and all browser manifests.

## 0.3.10 - 2026-04-08

### Improved

- Popup and the About & Help page now use the landing page visual palette with cream surfaces, earth-green accents, bright-green highlights, and bronze eyebrow styling.
- The popup is now the primary place for quick settings, while the options page now works as a lightweight About & Help screen with FAQ and recent updates.
- Project metadata now reflects `0.3.10` across `package.json`, `package-lock.json`, and all browser manifests.

## 0.3.9 - 2026-04-08

### Improved

- Manual expand and collapse controls now sit over a top fade for better contrast against bright video frames.
- The manual control button now uses a subtle hover-only background instead of showing a persistent button fill.
- Project metadata now reflects `0.3.9` across `package.json`, `package-lock.json`, and all browser manifests.

## 0.3.8 - 2026-04-08

### Fixed

- Release ZIP archives now preserve the built folder structure so manifest-referenced icons, assets, and chunks stay at the correct paths.
- Release ZIP archives now omit source maps and source-only icon artwork that are not needed for distribution.
- Project metadata now reflects `0.3.8` across `package.json` and all browser manifests.

## 0.3.7 - 2026-04-08

### Improved

- Manually expanded players now scroll into the vertical center of the viewport while opening.
- Project metadata now reflects `0.3.7` across `package.json` and all browser manifests.

## 0.3.6 - 2026-04-07

### Improved

- In manual mode, clicking outside an expanded player now collapses it just like pressing the collapse button.
- Manual expand and collapse transitions are now animated smoothly instead of jumping between states.
- Project metadata now reflects `0.3.6` across `package.json` and all browser manifests.

## 0.3.5 - 2026-04-04

### Improved

- Manual expand and collapse controls now use icon buttons instead of text labels.
- Manual controls now stay hidden until you hover the player, which better matches the native X player behavior.
- Project metadata now reflects `0.3.5` across `package.json` and all browser manifests.

## 0.3.4 - 2026-04-04

### Fixed

- Fixed the overlay layering on X so widened players stay below the sticky top bar instead of covering it.
- Fixed widened players so they can still render above the side columns while remaining attached to the feed layout.
- Project metadata now reflects `0.3.4` across `package.json` and all browser manifests.

## 0.3.3 - 2026-04-04

### Improved

- Width changes from popup and options now preview live on active players while you drag the slider.
- Final width settings are still saved only when the slider change is committed, which keeps persisted settings stable without requiring a page reload.
- Project metadata now reflects `0.3.3` across `package.json` and all browser manifests.

## 0.3.2 - 2026-04-04

### Improved

- Videos now expand more progressively while moving through the viewport instead of jumping straight to their widened size.
- Overlay positioning continues to react to scrolling and resizing while keeping the feed layout reserved with a placeholder.
- Project documentation now reflects the working MVP instead of the older scaffold-only description.

### Fixed

- Version metadata is now aligned at `0.3.2` across `package.json` and all browser manifests.

## Earlier Work

- Versions before `0.3.2` established the initial cross-browser extension scaffold, storage-backed settings, popup/options surfaces, and the first working player-move overlay behavior.
