export interface Settings {
  autoEnableMastodon: boolean;
  autoEnableX: boolean;
  widthPercent: number;
}

export const DEFAULT_SETTINGS: Settings = {
  autoEnableMastodon: true,
  autoEnableX: true,
  widthPercent: 35,
};

export const WIDTH_PERCENT_LIMITS = {
  max: 100,
  min: 0,
} as const;

export const OVERLAY_ROOT_ID = "wideplayer-overlay-root";
export const STYLE_ELEMENT_ID = "wideplayer-inline-styles";

export const X_HOSTS = new Set([
  "twitter.com",
  "www.twitter.com",
  "www.x.com",
  "x.com",
]);
