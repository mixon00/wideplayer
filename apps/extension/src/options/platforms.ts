import type { Platform } from "../shared/constants";
import type { Settings } from "../shared/constants";

export interface PlatformSettingsConfig {
  autoEnableKey: keyof Settings;
  description: string;
  iconSrc: string;
  label: string;
  platform: Platform;
  status: "Coming soon" | "Supported";
  widthPercentKey: keyof Settings;
}

export const PLATFORM_SETTINGS: PlatformSettingsConfig[] = [
  {
    autoEnableKey: "autoEnableX",
    description: "For supported videos in the X feed.",
    iconSrc: "icons/platform-x.svg",
    label: "X",
    platform: "x",
    status: "Supported",
    widthPercentKey: "widthPercentX",
  },
  {
    autoEnableKey: "autoEnableMastodon",
    description: "For supported native videos and YouTube cards.",
    iconSrc: "icons/platform-mastodon.svg",
    label: "Mastodon",
    platform: "mastodon",
    status: "Supported",
    widthPercentKey: "widthPercentMastodon",
  },
  {
    autoEnableKey: "autoEnableBluesky",
    description: "Settings are ready, platform support is not shipped yet.",
    iconSrc: "icons/platform-bluesky.svg",
    label: "Bluesky",
    platform: "bluesky",
    status: "Coming soon",
    widthPercentKey: "widthPercentBluesky",
  },
  {
    autoEnableKey: "autoEnableLinkedIn",
    description: "Settings are ready, platform support is not shipped yet.",
    iconSrc: "icons/platform-linkedin.svg",
    label: "LinkedIn",
    platform: "linkedin",
    status: "Coming soon",
    widthPercentKey: "widthPercentLinkedIn",
  },
];
