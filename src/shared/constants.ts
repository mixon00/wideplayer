export interface Settings {
  autoEnable: boolean;
  widthPercent: number;
}

export const DEFAULT_SETTINGS: Settings = {
  autoEnable: true,
  widthPercent: 135,
};

export const WIDTH_PERCENT_LIMITS = {
  max: 180,
  min: 110,
} as const;

export const OVERLAY_ROOT_ID = "wideplayer-overlay-root";
export const STYLE_ELEMENT_ID = "wideplayer-inline-styles";

export const SUPPORTED_HOSTS = new Set([
  "twitter.com",
  "www.twitter.com",
  "www.x.com",
  "x.com",
]);
