import { getExtensionApi, type StorageChangeListener } from "./browser-api";
import { DEFAULT_SETTINGS, type Settings, WIDTH_PERCENT_LIMITS } from "./constants";
import { readStorage, writeStorage } from "./storage";

interface StoredSettingsInput {
  autoEnable?: unknown;
  widthPercent?: unknown;
  expansionPercent?: unknown;
}

const STORAGE_DEFAULTS: StoredSettingsInput = {
  autoEnable: DEFAULT_SETTINGS.autoEnable,
  widthPercent: DEFAULT_SETTINGS.widthPercent,
  expansionPercent: undefined,
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
  return {
    autoEnable:
      typeof input?.autoEnable === "boolean" ? input.autoEnable : DEFAULT_SETTINGS.autoEnable,
    widthPercent: normalizeStoredWidthPercent(input),
  };
}

export async function loadSettings(): Promise<Settings> {
  const storedSettings = await readStorage(STORAGE_DEFAULTS);
  return normalizeSettings(storedSettings);
}

export async function saveSettings(nextSettings: Partial<Settings>): Promise<Settings> {
  const currentSettings = await loadSettings();
  const normalizedSettings = normalizeSettings({
    ...currentSettings,
    ...nextSettings,
  });

  await writeStorage(normalizedSettings);

  return normalizedSettings;
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
