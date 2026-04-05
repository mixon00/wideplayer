# Changelog

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
