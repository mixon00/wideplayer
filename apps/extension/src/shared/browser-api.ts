export interface ExtensionApi {
  runtime?: {
    lastError?: {
      message?: string;
    };
    onInstalled?: {
      addListener(listener: () => void): void;
    };
    onStartup?: {
      addListener(listener: () => void): void;
    };
    openOptionsPage?: () => Promise<void> | void;
  };
  storage?: {
    local?: StorageArea;
    sync?: StorageArea;
    onChanged?: {
      addListener(listener: StorageChangeListener): void;
      removeListener(listener: StorageChangeListener): void;
    };
  };
}

export interface StorageArea {
  get(...args: unknown[]): unknown;
  set(...args: unknown[]): unknown;
}

export interface StorageChange {
  newValue?: unknown;
  oldValue?: unknown;
}

export type StorageChangeListener = (
  changes: Record<string, StorageChange>,
  areaName: string
) => void | Promise<void>;

function getExtensionGlobal(): typeof globalThis & {
  browser?: ExtensionApi;
  chrome?: ExtensionApi;
} {
  return globalThis as typeof globalThis & {
    browser?: ExtensionApi;
    chrome?: ExtensionApi;
  };
}

export function getExtensionApi(): ExtensionApi | null {
  const extensionGlobal = getExtensionGlobal();
  return extensionGlobal.browser ?? extensionGlobal.chrome ?? null;
}

export function usesPromiseApi(): boolean {
  return Boolean(getExtensionGlobal().browser);
}

export function getRuntimeErrorMessage(): string | null {
  return getExtensionApi()?.runtime?.lastError?.message ?? null;
}
