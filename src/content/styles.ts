export const contentStyles = `
:root {
  --wideplayer-width-percent: 135;
}

#wideplayer-overlay-root {
  inset: 0;
  pointer-events: none;
  position: absolute;
  z-index: 2147483000;
}

article[data-wideplayer-candidate="true"] {
  --wideplayer-candidate-width: calc(var(--wideplayer-width-percent) * 1%);
}

.wideplayer-media-anchor {
  position: relative;
}
`;
