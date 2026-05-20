export type Platform = "bluesky" | "linkedin" | "mastodon" | "x";
export type SupportedPlatform = Extract<Platform, "mastodon" | "x">;

export interface Settings {
  autoEnableBluesky: boolean;
  autoEnableLinkedIn: boolean;
  autoEnableMastodon: boolean;
  autoEnableX: boolean;
  platformEnabledMastodon: boolean;
  platformEnabledX: boolean;
  widthPercentBluesky: number;
  widthPercentLinkedIn: number;
  widthPercentMastodon: number;
  widthPercentX: number;
}

export const DEFAULT_SETTINGS: Settings = {
  autoEnableBluesky: true,
  autoEnableLinkedIn: true,
  autoEnableMastodon: true,
  autoEnableX: true,
  platformEnabledMastodon: true,
  platformEnabledX: true,
  widthPercentBluesky: 35,
  widthPercentLinkedIn: 35,
  widthPercentMastodon: 35,
  widthPercentX: 35,
};

export const PLATFORMS = ["x", "mastodon", "bluesky", "linkedin"] as const satisfies readonly Platform[];

export const SUPPORTED_PLATFORMS = ["x", "mastodon"] as const satisfies readonly SupportedPlatform[];

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
