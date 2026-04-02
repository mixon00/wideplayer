# WidePlayer for X — PRD

## 1. Goal

Build a browser extension family for X (Twitter) that enlarges in-feed videos without fullscreen.

The extension must support two modes:
- automatic enlargement with no user interaction
- manual enlargement triggered from a player button when auto mode is disabled

Result:
- videos appear larger than tweet width
- feed layout remains intact
- scrolling remains natural
- the original player is moved, not duplicated
- behavior is configurable from extension settings
- browser-specific builds can diverge when compatibility requires it

---

## 2. Product Modes

### Auto Mode
- enabled by default
- enlarges supported videos automatically when detected and visible
- requires no clicks

### Manual Mode
- used when `autoEnable = false`
- injects an expand button into the player UI
- user can expand or collapse the video locally per tweet
- manual expansion uses the same moved player architecture as auto mode

---

## 3. Project Structure

The project is organized into browser-specific subfolders so each build can handle compatibility differences cleanly.

### Repository Layout

```text
/shared
  /core
  /content
  /overlay
  /settings
  /ui

/chrome
  manifest.json
  browser-adapter

/firefox
  manifest.json
  browser-adapter

/safari
  manifest.json
  browser-adapter
```

### Rules
- shared logic lives in `/shared`
- each browser folder contains only compatibility-specific code, packaging, and manifest differences
- Chrome is the baseline implementation
- Firefox and Safari may override APIs, styling hooks, or packaging details as needed
- feature parity is preferred, but graceful degradation is acceptable when browser limitations exist

---

## 4. Core Concept

Each supported tweet with video is modified in two layers:

### Layout Layer
- keep a placeholder inside the tweet
- preserve document flow and feed spacing
- store the original insertion point for restoration

### Render Layer
- use a single global overlay root attached to `document.body`
- move the original player into the overlay container
- allow the player to extend beyond tweet width
- restore the player back to its original location when deactivated

Important:
- the video element is not duplicated
- playback state must remain on the moved player
- if move/restore fails, the original player must remain usable in place

---

## 5. Architecture

### Components

**1. Detector**
- finds standard feed tweets containing a supported `<video>`
- ignores unsupported tweet types
- marks processed tweet instances

**2. Placeholder Manager**
- creates and updates the in-tweet placeholder
- preserves layout height
- stores the original parent and sibling anchor for restoration

**3. Overlay Root**
- single global container attached to `document.body`
- owns z-index and positioning context
- hosts active moved players

**4. Player Mover**
- moves the original player from tweet media into overlay
- restores the original player back to the tweet on collapse, cleanup, or failure
- prevents duplicate mounting

**5. Overlay Instance**
- one per active tweet
- controls size, position, and visual container styling
- wraps the moved player

**6. Viewport Controller**
- activates overlays only for visible tweets in auto mode
- suspends or restores players when tweets leave the viewport
- coordinates lifecycle during scroll and navigation

**7. Settings Store**
- persists user settings per browser extension build
- exposes runtime config to content scripts
- listens for settings changes and reapplies behavior

**8. Manual Trigger Controller**
- injects an expand/collapse button into the player UI when auto mode is disabled
- handles per-tweet manual toggling

**9. Browser Adapter**
- isolates browser API differences
- abstracts storage, messaging, manifest behavior, and styling quirks

---

## 6. Flow

1. Observe DOM using `MutationObserver`
2. Detect standard feed tweet containing a supported video
3. If not processed:
   - mark tweet
   - locate media container
   - measure original size
   - capture original DOM insertion point
4. Read current extension settings
5. Compute target size
6. Create or update placeholder
7. Register tweet as overlay-capable
8. Branch by mode:
   - if auto mode is enabled and tweet is visible, move player into overlay
   - if auto mode is disabled, inject manual expand button and wait for click
9. On scroll or resize:
   - update overlay position
   - keep placeholder synchronized
10. On collapse, navigation, DOM invalidation, or cleanup:
   - restore player to original location
   - remove overlay instance
11. On failure:
   - abort enhancement
   - leave original player functional inside tweet

---

## 7. Sizing Logic

### Inputs
- tweet width
- video aspect ratio
- viewport width
- user setting: target width percent

### Output
- `targetWidth = min(tweetWidth * widthPercent, viewportWidth - margin * 2)`
- `targetHeight = targetWidth / aspectRatio`
- `finalHeight = clamp(targetHeight, minHeight, maxHeight)`
- `finalWidth = finalHeight * aspectRatio`

### Recommended Defaults
- width percent: `135%`
- allowed width range: `110%` to `180%`
- min height: `360px`
- max height: `520px`
- horizontal viewport margin: `24px`

Notes:
- if height clamp reduces width, use the clamped width derived from aspect ratio
- if viewport is narrow, fit to viewport before applying final render position

---

## 8. Positioning

- anchor = bounding rect of the original media section
- overlay top = anchor top relative to page scroll
- overlay horizontal center = anchor center
- overlay transform = `translateX(-50%)`
- overlay width may exceed tweet width
- placeholder height must always match the rendered overlay height

Position updates are required on:
- scroll
- resize
- feed relayout
- player state changes that affect controls height

---

## 9. Interaction

### Auto Mode
- overlay becomes the primary interactive player immediately
- original in-tweet player location is replaced by placeholder

### Manual Mode
- inject a new expand button into the player controls
- button toggles expanded/collapsed state for that tweet
- collapse restores the player to its original location

### Common Rules
- only the moved player is interactive
- pointer events are enabled on the overlay container
- no duplicate playback surface exists
- if multiple tweets are active, each overlay maps to its own original player

---

## 10. Settings

The extension must include a settings UI.

### Required Settings
- `autoEnable` — on/off
- `widthPercent` — user-defined enlargement width in percent

### Behavior
- settings persist using extension storage
- changes apply without page reload when possible
- defaults are provided on first install

### UX Rules
- when `autoEnable = true`, videos enlarge automatically
- when `autoEnable = false`, no automatic enlargement occurs
- when `autoEnable = false`, the player receives a new expand button for local activation

---

## 11. Browser Compatibility Strategy

### Chrome Build
- primary reference build
- targets current Chromium extension APIs

### Firefox Build
- separate folder for Firefox-specific manifest, API, and styling adjustments
- may require adapter differences for storage, messaging, or UI injection behavior

### Safari Build
- separate folder for Safari-specific compatibility work
- may require additional packaging or API translation
- feature parity is desired, but fallback behavior is acceptable if Safari imposes limitations

### Compatibility Principle
- browser-specific differences should not leak into shared business logic unless unavoidable

---

## 12. Performance

- activate auto overlays only for visible tweets using `IntersectionObserver`
- throttle or batch scroll and resize updates
- prefer `requestAnimationFrame` for position sync
- reuse overlay containers where practical
- cleanup detached tweets aggressively
- avoid repeated DOM queries for already processed tweets

---

## 13. Scope (MVP)

Supported:
- single video in standard feed tweet
- automatic mode
- manual mode with player button
- persistent extension settings
- browser-specific project folders for Chrome, Firefox, and Safari

Not supported in v1:
- quoted tweets
- multi-media tweets
- GIFs
- modal view
- non-standard X surfaces if DOM differs significantly

---

## 14. Risks

### DOM Instability
- avoid deep selectors
- rely on stable anchors such as `<article>`, media containers, and `<video>`

### Move Safety
- moving the player may break if X tightly couples the node to internal rendering
- fallback must restore or leave the original player untouched

### Clipping
- solved via global overlay root

### Z-Index Conflicts
- controlled via dedicated overlay root

### Scroll Sync
- requires continuous position updates

### Browser Drift
- different browsers may require separate manifest and API handling over time

---

## 15. Success Criteria

- supported videos enlarge beyond tweet width without fullscreen
- feed layout remains stable during scroll
- auto mode requires no user interaction
- manual mode exposes a working expand button when auto mode is disabled
- the same original player is moved and restored without creating a duplicate player
- settings persist across sessions
- unsupported cases fail gracefully without breaking the tweet player

---

## 16. Acceptance Criteria

- when a supported tweet video enters the viewport in auto mode, it enlarges automatically
- when `autoEnable` is disabled, no automatic enlargement occurs
- when `autoEnable` is disabled, the injected player button expands the video locally
- collapsing a manually expanded video restores the player to the original tweet position
- changing `widthPercent` updates future overlay sizing and can be applied live when feasible
- if overlay initialization fails, the original tweet video stays usable
- Chrome, Firefox, and Safari builds live in separate subfolders with shared core logic

---

## 17. Future Enhancements

- per-browser feature flags
- adjustable max height
- per-site or per-page enable toggle
- hover-based quick actions
- quoted tweet support
- adaptive scaling by viewport category
- animation transitions
- keyboard shortcut for manual expand

---

## 18. Product Summary

WidePlayer for X is a browser extension family that enlarges in-feed X videos beyond tweet width while preserving feed layout and natural scrolling. It moves the original player into a global overlay, supports both automatic and manual expansion modes, stores user preferences, and ships as browser-specific builds for Chrome, Firefox, and Safari.
