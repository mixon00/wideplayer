import { getExtensionApi, type StorageChangeListener } from "./browser-api";
import { DEFAULT_SETTINGS, type Settings, WIDTH_PERCENT_LIMITS } from "./constants";
import { readStorage, writeStorage } from "./storage";

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

export function normalizeSettings(input?: Partial<Settings>): Settings {
  return {
    autoEnable:
      typeof input?.autoEnable === "boolean" ? input.autoEnable : DEFAULT_SETTINGS.autoEnable,
    widthPercent: clampWidthPercent(input?.widthPercent),
  };
}

export async function loadSettings(): Promise<Settings> {
  const storedSettings = await readStorage(DEFAULT_SETTINGS);
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

    if (!("autoEnable" in changes) && !("widthPercent" in changes)) {
      return;
    }

    listener(await loadSettings());
  };

  storage.onChanged.addListener(handleStorageChange);

  return () => {
    storage.onChanged?.removeListener(handleStorageChange);
  };
}
