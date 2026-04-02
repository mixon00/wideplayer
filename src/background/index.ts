import { loadSettings, saveSettings } from "../shared/settings";

function getRuntime() {
  return (
    (globalThis as typeof globalThis & { browser?: { runtime?: unknown }; chrome?: { runtime?: unknown } })
      .browser?.runtime ??
    (globalThis as typeof globalThis & { chrome?: { runtime?: unknown } }).chrome?.runtime
  ) as
    | {
        onInstalled?: { addListener(listener: () => void): void };
        onStartup?: { addListener(listener: () => void): void };
      }
    | undefined;
}

async function ensureDefaultSettings(): Promise<void> {
  const currentSettings = await loadSettings();
  await saveSettings(currentSettings);
}

const runtime = getRuntime();

runtime?.onInstalled?.addListener(() => {
  void ensureDefaultSettings();
});

runtime?.onStartup?.addListener(() => {
  void ensureDefaultSettings();
});
