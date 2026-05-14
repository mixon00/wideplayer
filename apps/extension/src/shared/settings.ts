import { getExtensionApi, type StorageChangeListener } from "./browser-api";
import { DEFAULT_SETTINGS, type Settings, WIDTH_PERCENT_LIMITS } from "./constants";
import { readStorage, writeStorage } from "./storage";

interface StoredSettingsInput {
  autoEnable?: unknown;
  autoEnableMastodon?: unknown;
  autoEnableX?: unknown;
  widthPercent?: unknown;
  expansionPercent?: unknown;
}

interface LiveWidthPreviewInput {
  updatedAt?: unknown;
  widthPercent?: unknown;
}

export interface LiveWidthPreview {
  updatedAt: number;
  widthPercent: number;
}

const STORAGE_DEFAULTS: StoredSettingsInput = {
  autoEnable: undefined,
  autoEnableMastodon: DEFAULT_SETTINGS.autoEnableMastodon,
  autoEnableX: DEFAULT_SETTINGS.autoEnableX,
  widthPercent: DEFAULT_SETTINGS.widthPercent,
  expansionPercent: undefined,
};

const LIVE_WIDTH_PREVIEW_KEY = "liveWidthPreview";
const LIVE_WIDTH_PREVIEW_DEFAULTS: Record<typeof LIVE_WIDTH_PREVIEW_KEY, LiveWidthPreviewInput | null> = {
  liveWidthPreview: null,
};

function normalizeStoredWidthPercent(input?: StoredSettingsInput): number {
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

  return DEFAULT_SETTINGS.widthPercent;
}

function mapLegacyWidthPercentToSliderPercent(value: number): number {
  const numericValue = Number(value);

  return clampWidthPercent(Math.round(numericValue) - 100);
}

export function clampWidthPercent(value: unknown): number {
  const numericValue = Number(value);
  const normalizedValue = Number.isFinite(numericValue)
    ? numericValue
    : DEFAULT_SETTINGS.widthPercent;

  return Math.min(
    WIDTH_PERCENT_LIMITS.max,
    Math.max(WIDTH_PERCENT_LIMITS.min, Math.round(normalizedValue))
  );
}

export function normalizeSettings(input?: StoredSettingsInput): Settings {
  const legacyAutoEnable =
    typeof input?.autoEnable === "boolean" ? input.autoEnable : undefined;

  return {
    autoEnableMastodon:
      typeof input?.autoEnableMastodon === "boolean"
        ? input.autoEnableMastodon
        : legacyAutoEnable ?? DEFAULT_SETTINGS.autoEnableMastodon,
    autoEnableX:
      typeof input?.autoEnableX === "boolean"
        ? input.autoEnableX
        : legacyAutoEnable ?? DEFAULT_SETTINGS.autoEnableX,
    widthPercent: normalizeStoredWidthPercent(input),
  };
}

function normalizeLiveWidthPreview(input?: LiveWidthPreviewInput | null): LiveWidthPreview | null {
  if (!input) {
    return null;
  }

  const widthPercent = clampWidthPercent(input.widthPercent);
  const updatedAt = Number(input.updatedAt);

  if (!Number.isFinite(updatedAt) || updatedAt <= 0) {
    return null;
  }

  return {
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
    nextSettingsInput.autoEnableMastodon = nextSettings.autoEnable;
    nextSettingsInput.autoEnableX = nextSettings.autoEnable;
  }

  const normalizedSettings = normalizeSettings({
    ...nextSettingsInput,
  });

  await writeStorage(normalizedSettings);

  return normalizedSettings;
}

export async function saveLiveWidthPreview(widthPercent: unknown | null): Promise<void> {
  const nextPreview =
    widthPercent === null
      ? null
      : {
          updatedAt: Date.now(),
          widthPercent: clampWidthPercent(widthPercent),
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
      !("autoEnableMastodon" in changes) &&
      !("autoEnableX" in changes) &&
      !("widthPercent" in changes) &&
      !("expansionPercent" in changes)
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
