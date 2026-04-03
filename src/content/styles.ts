export const contentStyles = `
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
  box-shadow: var(--wideplayer-overlay-shadow);
  overflow: hidden;
  pointer-events: auto;
  position: absolute;
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
