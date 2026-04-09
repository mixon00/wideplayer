export const contentStyles = `
@property --wideplayer-scroll-progress {
  inherits: false;
  initial-value: 0;
  syntax: "<number>";
}

:root {
  --wideplayer-width-percent: 135;
  --wideplayer-overlay-radius: 16px;
  --wideplayer-manual-transition-duration: 180ms;
  --wideplayer-manual-transition-easing: cubic-bezier(0.22, 1, 0.36, 1);
  --wideplayer-overlay-shadow: 0 10px 28px rgba(15, 20, 25, 0.18),
    0 0 0 1px rgba(15, 20, 25, 0.08);
  --wideplayer-toggle-background-hover: rgba(255, 255, 255, 0.14);
  --wideplayer-toggle-color: #ffffff;
  --wideplayer-toggle-top-fade: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.72) 0%,
    rgba(0, 0, 0, 0.4) 42%,
    rgba(0, 0, 0, 0.18) 70%,
    rgba(0, 0, 0, 0) 100%
  );
  --wideplayer-toggle-top-fade-height: min(96px, 42%);
}

#wideplayer-overlay-root {
  inset: 0;
  overflow: visible;
  pointer-events: none;
  position: fixed;
  z-index: 1;
}

main[data-wideplayer-overlay-layer="true"] {
  position: relative;
  z-index: 4;
}

article[data-wideplayer-candidate="true"] {
  --wideplayer-candidate-width: calc(var(--wideplayer-width-percent) * 1%);
}

article[data-wideplayer-candidate="true"][data-wideplayer-state="expanded"] {
  z-index: 1;
}

.wideplayer-player-root {
  position: relative;
}

html[data-wideplayer-mode="manual"] .wideplayer-player-root::after {
  background: var(--wideplayer-toggle-top-fade);
  border-top-left-radius: inherit;
  border-top-right-radius: inherit;
  content: "";
  height: var(--wideplayer-toggle-top-fade-height);
  inset: 0 0 auto;
  opacity: 0;
  pointer-events: none;
  position: absolute;
  transition: opacity 120ms ease;
  z-index: 1;
}

html[data-wideplayer-mode="manual"] .wideplayer-player-root:hover::after,
html[data-wideplayer-mode="manual"] .wideplayer-player-root:focus-within::after {
  opacity: 1;
}

.wideplayer-overlay-frame {
  border-radius: var(--wideplayer-overlay-radius);
  box-shadow:
    0 calc(8px + var(--wideplayer-scroll-progress) * 4px)
    calc(20px + var(--wideplayer-scroll-progress) * 8px)
    rgba(15, 20, 25, calc(0.12 + var(--wideplayer-scroll-progress) * 0.06)),
    0 0 0 1px rgba(15, 20, 25, calc(0.04 + var(--wideplayer-scroll-progress) * 0.04));
  overflow: hidden;
  pointer-events: auto;
  position: absolute;
  will-change: height, left, top, width;
}

.wideplayer-overlay-frame[data-wideplayer-transition] {
  transition:
    box-shadow var(--wideplayer-manual-transition-duration) var(--wideplayer-manual-transition-easing),
    height var(--wideplayer-manual-transition-duration) var(--wideplayer-manual-transition-easing),
    left var(--wideplayer-manual-transition-duration) var(--wideplayer-manual-transition-easing),
    top var(--wideplayer-manual-transition-duration) var(--wideplayer-manual-transition-easing),
    width var(--wideplayer-manual-transition-duration) var(--wideplayer-manual-transition-easing);
}

.wideplayer-overlay-surface {
  background: transparent;
  border-radius: inherit;
  height: 100%;
  isolation: isolate;
  overflow: hidden;
  pointer-events: auto;
  width: 100%;
}

.wideplayer-overlay-surface > * {
  border-radius: inherit;
  height: 100%;
  width: 100%;
}

.wideplayer-placeholder {
  display: block;
  pointer-events: none;
  will-change: height;
  width: 100%;
}

.wideplayer-placeholder[data-wideplayer-transition] {
  transition: height var(--wideplayer-manual-transition-duration) var(--wideplayer-manual-transition-easing);
}

.wideplayer-player-mounted {
  border-radius: inherit;
  display: flex;
  height: 100%;
  justify-content: center;
  overflow: hidden;
  width: 100%;
}

.wideplayer-player-mounted > * {
  max-width: 100%;
}

.wideplayer-player-root[data-wideplayer-expanded="true"] {
  display: flex;
  height: 100%;
  justify-content: center;
}

.wideplayer-player-root[data-wideplayer-expanded="true"] > :not(.wideplayer-toggle-button) {
  flex-shrink: 0;
  max-width: 100%;
}

.wideplayer-toggle-button {
  align-items: center;
  appearance: none;
  background: transparent;
  border: 0;
  border-radius: 999px;
  color: var(--wideplayer-toggle-color);
  cursor: pointer;
  display: inline-flex;
  height: 40px;
  justify-content: center;
  line-height: 0;
  opacity: 0;
  padding: 8px;
  pointer-events: none;
  position: absolute;
  right: 12px;
  top: 12px;
  transition: opacity 120ms ease, background-color 120ms ease;
  width: 40px;
  z-index: 2;
}

.wideplayer-player-root:hover .wideplayer-toggle-button,
.wideplayer-player-root:focus-within .wideplayer-toggle-button,
.wideplayer-toggle-button:focus-visible {
  opacity: 1;
  pointer-events: auto;
}

.wideplayer-toggle-button:hover {
  background: var(--wideplayer-toggle-background-hover);
}

.wideplayer-toggle-button svg {
  display: block;
  height: 20px;
  pointer-events: none;
  width: 20px;
}

.wideplayer-toggle-button svg * {
  pointer-events: none;
}

.wideplayer-toggle-button:focus-visible {
  background: var(--wideplayer-toggle-background-hover);
  outline: 2px solid #1d9bf0;
  outline-offset: 2px;
}
`;
