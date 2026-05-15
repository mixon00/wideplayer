import type { Platform } from "../shared/constants";
import type { Settings } from "../shared/constants";

export interface PlatformSettingsConfig {
  autoEnableKey: keyof Settings;
  description: string;
  label: string;
  platform: Platform;
  status: "Coming soon" | "Supported";
  widthPercentKey: keyof Settings;
}

export const PLATFORM_SETTINGS: PlatformSettingsConfig[] = [
  {
    autoEnableKey: "autoEnableX",
    description: "For supported videos in the X feed.",
    label: "X",
    platform: "x",
    status: "Supported",
    widthPercentKey: "widthPercentX",
  },
  {
    autoEnableKey: "autoEnableMastodon",
    description: "For supported native videos and YouTube cards.",
    label: "Mastodon",
    platform: "mastodon",
    status: "Supported",
    widthPercentKey: "widthPercentMastodon",
  },
  {
    autoEnableKey: "autoEnableBluesky",
    description: "Settings are ready, platform support is not shipped yet.",
    label: "Bluesky",
    platform: "bluesky",
    status: "Coming soon",
    widthPercentKey: "widthPercentBluesky",
  },
  {
    autoEnableKey: "autoEnableLinkedIn",
    description: "Settings are ready, platform support is not shipped yet.",
    label: "LinkedIn",
    platform: "linkedin",
    status: "Coming soon",
    widthPercentKey: "widthPercentLinkedIn",
  },
];
