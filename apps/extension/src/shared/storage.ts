import { getExtensionApi, getRuntimeErrorMessage, usesPromiseApi, type StorageArea } from "./browser-api";

export type StorageAreaName = "local" | "sync";

type StorageValues = object;

function getStorageArea(areaName: StorageAreaName): StorageArea | null {
  const storage = getExtensionApi()?.storage;
  return storage?.[areaName] ?? storage?.local ?? null;
}

function mergeDefaults<T extends StorageValues>(
  defaults: T,
  values: Partial<T> | Record<string, unknown>
): T {
  return {
    ...defaults,
    ...values,
  };
}

export async function readStorage<T extends StorageValues>(
  defaults: T,
  areaName: StorageAreaName = "sync"
): Promise<T> {
  const storageArea = getStorageArea(areaName);

  if (!storageArea) {
    return {
      ...defaults,
    };
  }

  if (usesPromiseApi()) {
    const values = (await storageArea.get(defaults)) as Partial<T> | Record<string, unknown>;
    return mergeDefaults(defaults, values ?? {});
  }

  return await new Promise<T>((resolve, reject) => {
    storageArea.get(defaults, (values: Partial<T> | Record<string, unknown>) => {
      const runtimeErrorMessage = getRuntimeErrorMessage();

      if (runtimeErrorMessage) {
        reject(new Error(runtimeErrorMessage));
        return;
      }

      resolve(mergeDefaults(defaults, values ?? {}));
    });
  });
}

export async function writeStorage<T extends StorageValues>(
  values: T,
  areaName: StorageAreaName = "sync"
): Promise<void> {
  const storageArea = getStorageArea(areaName);

  if (!storageArea) {
    return;
  }

  if (usesPromiseApi()) {
    await storageArea.set(values);
    return;
  }

  await new Promise<void>((resolve, reject) => {
    storageArea.set(values, () => {
      const runtimeErrorMessage = getRuntimeErrorMessage();

      if (runtimeErrorMessage) {
        reject(new Error(runtimeErrorMessage));
        return;
      }

      resolve();
    });
  });
}
