import { getExtensionApi, type StorageChangeListener } from "./browser-api";
import {
  DEFAULT_SETTINGS,
  PLATFORMS,
  type Platform,
  type Settings,
  type SupportedPlatform,
  WIDTH_PERCENT_LIMITS,
} from "./constants";
import { readStorage, writeStorage } from "./storage";

interface StoredSettingsInput {
  autoEnable?: unknown;
  autoEnableBluesky?: unknown;
  autoEnableLinkedIn?: unknown;
  autoEnableMastodon?: unknown;
  autoEnableX?: unknown;
  platformEnabledMastodon?: unknown;
  platformEnabledX?: unknown;
  widthPercentBluesky?: unknown;
  widthPercentLinkedIn?: unknown;
  widthPercentMastodon?: unknown;
  widthPercentX?: unknown;
  widthPercent?: unknown;
  expansionPercent?: unknown;
}

interface LiveWidthPreviewInput {
  platform?: unknown;
  updatedAt?: unknown;
  widthPercent?: unknown;
}

export interface LiveWidthPreview {
  platform: SupportedPlatform;
  updatedAt: number;
  widthPercent: number;
}

const STORAGE_DEFAULTS: StoredSettingsInput = {
  autoEnable: undefined,
  autoEnableBluesky: DEFAULT_SETTINGS.autoEnableBluesky,
  autoEnableLinkedIn: DEFAULT_SETTINGS.autoEnableLinkedIn,
  autoEnableMastodon: DEFAULT_SETTINGS.autoEnableMastodon,
  autoEnableX: DEFAULT_SETTINGS.autoEnableX,
  expansionPercent: undefined,
  platformEnabledMastodon: DEFAULT_SETTINGS.platformEnabledMastodon,
  platformEnabledX: DEFAULT_SETTINGS.platformEnabledX,
  widthPercent: undefined,
  widthPercentBluesky: DEFAULT_SETTINGS.widthPercentBluesky,
  widthPercentLinkedIn: DEFAULT_SETTINGS.widthPercentLinkedIn,
  widthPercentMastodon: DEFAULT_SETTINGS.widthPercentMastodon,
  widthPercentX: DEFAULT_SETTINGS.widthPercentX,
};

const LIVE_WIDTH_PREVIEW_KEY = "liveWidthPreview";
const LIVE_WIDTH_PREVIEW_DEFAULTS: Record<typeof LIVE_WIDTH_PREVIEW_KEY, LiveWidthPreviewInput | null> = {
  liveWidthPreview: null,
};

function getAutoEnableKey(platform: Platform): keyof Settings {
  switch (platform) {
    case "bluesky":
      return "autoEnableBluesky";
    case "linkedin":
      return "autoEnableLinkedIn";
    case "mastodon":
      return "autoEnableMastodon";
    case "x":
      return "autoEnableX";
  }
}

function getPlatformEnabledKey(platform: SupportedPlatform): keyof Settings {
  switch (platform) {
    case "mastodon":
      return "platformEnabledMastodon";
    case "x":
      return "platformEnabledX";
  }
}

function getWidthPercentKey(platform: Platform): keyof Settings {
  switch (platform) {
    case "bluesky":
      return "widthPercentBluesky";
    case "linkedin":
      return "widthPercentLinkedIn";
    case "mastodon":
      return "widthPercentMastodon";
    case "x":
      return "widthPercentX";
  }
}

export function getPlatformAutoEnable(settings: Settings, platform: Platform): boolean {
  if (platform === "mastodon" || platform === "x") {
    return getPlatformEnabled(settings, platform) && Boolean(settings[getAutoEnableKey(platform)]);
  }

  return Boolean(settings[getAutoEnableKey(platform)]);
}

export function getPlatformEnabled(settings: Settings, platform: SupportedPlatform): boolean {
  return Boolean(settings[getPlatformEnabledKey(platform)]);
}

export function getPlatformWidthPercent(settings: Settings, platform: Platform): number {
  return Number(settings[getWidthPercentKey(platform)]);
}

function normalizeLegacyWidthPercent(input?: StoredSettingsInput): number {
  const widthPercentValue = Number(input?.widthPercent);
  const hasWidthPercent = Number.isFinite(widthPercentValue);

  if (hasWidthPercent && widthPercentValue >= 0 && widthPercentValue <= 100) {
    return clampWidthPercent(widthPercentValue);
  }

  if (input?.expansionPercent !== undefined) {
    return clampWidthPercent(input.expansionPercent);
  }

  if (hasWidthPercent) {
    return mapLegacyWidthPercentToSliderPercent(widthPercentValue);
  }

  return DEFAULT_SETTINGS.widthPercentX;
}

function mapLegacyWidthPercentToSliderPercent(value: number): number {
  const numericValue = Number(value);

  return clampWidthPercent(Math.round(numericValue) - 100);
}

export function clampWidthPercent(value: unknown): number {
  const numericValue = Number(value);
  const normalizedValue = Number.isFinite(numericValue)
    ? numericValue
    : DEFAULT_SETTINGS.widthPercentX;

  return Math.min(
    WIDTH_PERCENT_LIMITS.max,
    Math.max(WIDTH_PERCENT_LIMITS.min, Math.round(normalizedValue))
  );
}

export function normalizeSettings(input?: StoredSettingsInput): Settings {
  const legacyAutoEnable =
    typeof input?.autoEnable === "boolean" ? input.autoEnable : undefined;
  const legacyWidthPercent = normalizeLegacyWidthPercent(input);

  return {
    autoEnableBluesky:
      typeof input?.autoEnableBluesky === "boolean"
        ? input.autoEnableBluesky
        : legacyAutoEnable ?? DEFAULT_SETTINGS.autoEnableBluesky,
    autoEnableLinkedIn:
      typeof input?.autoEnableLinkedIn === "boolean"
        ? input.autoEnableLinkedIn
        : legacyAutoEnable ?? DEFAULT_SETTINGS.autoEnableLinkedIn,
    autoEnableMastodon:
      typeof input?.autoEnableMastodon === "boolean"
        ? input.autoEnableMastodon
        : legacyAutoEnable ?? DEFAULT_SETTINGS.autoEnableMastodon,
    autoEnableX:
      typeof input?.autoEnableX === "boolean"
        ? input.autoEnableX
        : legacyAutoEnable ?? DEFAULT_SETTINGS.autoEnableX,
    platformEnabledMastodon:
      typeof input?.platformEnabledMastodon === "boolean"
        ? input.platformEnabledMastodon
        : DEFAULT_SETTINGS.platformEnabledMastodon,
    platformEnabledX:
      typeof input?.platformEnabledX === "boolean"
        ? input.platformEnabledX
        : DEFAULT_SETTINGS.platformEnabledX,
    widthPercentBluesky:
      input?.widthPercentBluesky !== undefined
        ? clampWidthPercent(input.widthPercentBluesky)
        : DEFAULT_SETTINGS.widthPercentBluesky,
    widthPercentLinkedIn:
      input?.widthPercentLinkedIn !== undefined
        ? clampWidthPercent(input.widthPercentLinkedIn)
        : DEFAULT_SETTINGS.widthPercentLinkedIn,
    widthPercentMastodon:
      input?.widthPercentMastodon !== undefined
        ? clampWidthPercent(input.widthPercentMastodon)
        : legacyWidthPercent,
    widthPercentX:
      input?.widthPercentX !== undefined ? clampWidthPercent(input.widthPercentX) : legacyWidthPercent,
  };
}

function normalizeLiveWidthPreview(input?: LiveWidthPreviewInput | null): LiveWidthPreview | null {
  if (!input) {
    return null;
  }

  const widthPercent = clampWidthPercent(input.widthPercent);
  const updatedAt = Number(input.updatedAt);
  const platform = input.platform;

  if (!Number.isFinite(updatedAt) || updatedAt <= 0 || (platform !== "x" && platform !== "mastodon")) {
    return null;
  }

  return {
    platform,
    updatedAt,
    widthPercent,
  };
}

export async function loadSettings(): Promise<Settings> {
  const storedSettings = await readStorage(STORAGE_DEFAULTS);
  return normalizeSettings(storedSettings);
}

export async function saveSettings(nextSettings: Partial<Settings>): Promise<Settings> {
  const currentSettings = await loadSettings();
  const nextSettingsInput: StoredSettingsInput = {
    ...currentSettings,
    ...nextSettings,
  };

  if ("autoEnable" in nextSettings && typeof nextSettings.autoEnable === "boolean") {
    nextSettingsInput.autoEnableBluesky = nextSettings.autoEnable;
    nextSettingsInput.autoEnableLinkedIn = nextSettings.autoEnable;
    nextSettingsInput.autoEnableMastodon = nextSettings.autoEnable;
    nextSettingsInput.autoEnableX = nextSettings.autoEnable;
  }

  const normalizedSettings = normalizeSettings({
    ...nextSettingsInput,
  });

  await writeStorage(normalizedSettings);

  return normalizedSettings;
}

export async function saveLiveWidthPreview(
  preview: { platform: SupportedPlatform; widthPercent: unknown } | null
): Promise<void> {
  const nextPreview =
    preview === null
      ? null
      : {
          platform: preview.platform,
          updatedAt: Date.now(),
          widthPercent: clampWidthPercent(preview.widthPercent),
        };

  await writeStorage(
    {
      [LIVE_WIDTH_PREVIEW_KEY]: nextPreview,
    },
    "local"
  );
}

export async function loadLiveWidthPreview(): Promise<LiveWidthPreview | null> {
  const storedPreview = await readStorage(LIVE_WIDTH_PREVIEW_DEFAULTS, "local");
  return normalizeLiveWidthPreview(storedPreview.liveWidthPreview);
}

export function subscribeToSettings(listener: (settings: Settings) => void): () => void {
  const storage = getExtensionApi()?.storage;

  if (!storage?.onChanged) {
    return () => {};
  }

  const handleStorageChange: StorageChangeListener = async (changes, areaName) => {
    if (areaName !== "local" && areaName !== "sync") {
      return;
    }

    if (
      !("autoEnable" in changes) &&
      !("widthPercent" in changes) &&
      !("expansionPercent" in changes) &&
      !PLATFORMS.some((platform) => {
        const autoEnableKey = getAutoEnableKey(platform);
        const widthPercentKey = getWidthPercentKey(platform);
        const platformEnabledChanged =
          (platform === "mastodon" || platform === "x") &&
          getPlatformEnabledKey(platform) in changes;

        return autoEnableKey in changes || platformEnabledChanged || widthPercentKey in changes;
      })
    ) {
      return;
    }

    listener(await loadSettings());
  };

  storage.onChanged.addListener(handleStorageChange);

  return () => {
    storage.onChanged?.removeListener(handleStorageChange);
  };
}

export function subscribeToLiveWidthPreview(
  listener: (preview: LiveWidthPreview | null) => void
): () => void {
  const storage = getExtensionApi()?.storage;

  if (!storage?.onChanged) {
    return () => {};
  }

  const handleStorageChange: StorageChangeListener = (changes, areaName) => {
    if (areaName !== "local" || !(LIVE_WIDTH_PREVIEW_KEY in changes)) {
      return;
    }

    listener(normalizeLiveWidthPreview(changes[LIVE_WIDTH_PREVIEW_KEY]?.newValue as LiveWidthPreviewInput | null));
  };

  storage.onChanged.addListener(handleStorageChange);

  return () => {
    storage.onChanged?.removeListener(handleStorageChange);
  };
}
