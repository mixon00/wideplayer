export const contentStyles = `
@property --wideplayer-scroll-progress {
  inherits: false;
  initial-value: 0;
  syntax: "<number>";
}

:root {
  --wideplayer-width-percent: 135;
  --wideplayer-overlay-radius: 16px;
  --wideplayer-overlay-shadow: 0 10px 28px rgba(15, 20, 25, 0.18),
    0 0 0 1px rgba(15, 20, 25, 0.08);
  --wideplayer-toggle-background: rgba(15, 20, 25, 0.88);
  --wideplayer-toggle-color: #ffffff;
}

#wideplayer-overlay-root {
  inset: 0;
  overflow: visible;
  pointer-events: none;
  position: fixed;
  z-index: 2147483000;
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

.wideplayer-player-mounted {
  border-radius: inherit;
  height: 100%;
  overflow: hidden;
  width: 100%;
}

.wideplayer-toggle-button {
  appearance: none;
  background: var(--wideplayer-toggle-background);
  border: 0;
  border-radius: 999px;
  color: var(--wideplayer-toggle-color);
  cursor: pointer;
  font: 600 12px/1 system-ui, sans-serif;
  padding: 8px 12px;
  position: absolute;
  right: 12px;
  top: 12px;
  z-index: 2;
}

.wideplayer-toggle-button:focus-visible {
  outline: 2px solid #1d9bf0;
  outline-offset: 2px;
}

.wideplayer-toggle-button[data-wideplayer-state="expanded"] {
  background: rgba(29, 155, 240, 0.92);
}
`;
