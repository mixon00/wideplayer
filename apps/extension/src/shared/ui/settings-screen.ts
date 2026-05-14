import { getExtensionApi } from "../browser-api";
import {
  clampWidthPercent,
  loadSettings,
  saveLiveWidthPreview,
  saveSettings,
} from "../settings";

interface SettingsScreenElements {
  autoEnableInput: HTMLInputElement;
  autoEnableMastodonInput: HTMLInputElement;
  autoEnableXInput: HTMLInputElement;
  widthRangeInput: HTMLInputElement;
  widthOutput: HTMLOutputElement;
  widthNumberInput?: HTMLInputElement | null;
  statusText: HTMLElement;
  initialStatusText?: string;
  clearSavedStatusAfterMs?: number;
  openOptionsButton?: HTMLButtonElement | null;
}

export function mountSettingsScreen(elements: SettingsScreenElements): void {
  const {
    autoEnableInput,
    autoEnableMastodonInput,
    autoEnableXInput,
    widthRangeInput,
    widthOutput,
    widthNumberInput,
    statusText,
    initialStatusText,
    clearSavedStatusAfterMs,
    openOptionsButton,
  } = elements;

  let statusResetTimeoutId = 0;

  function syncMasterAutoToggle(): void {
    const allEnabled = autoEnableMastodonInput.checked && autoEnableXInput.checked;
    const allDisabled = !autoEnableMastodonInput.checked && !autoEnableXInput.checked;

    autoEnableInput.checked = allEnabled;
    autoEnableInput.indeterminate = !allEnabled && !allDisabled;
    autoEnableInput.dataset.toggleState = autoEnableInput.indeterminate
      ? "mixed"
      : allEnabled
        ? "on"
        : "off";
  }

  function setStatus(message: string): void {
    if (statusResetTimeoutId) {
      window.clearTimeout(statusResetTimeoutId);
      statusResetTimeoutId = 0;
    }

    statusText.textContent = message;

    if (message === "Saved" && clearSavedStatusAfterMs) {
      statusResetTimeoutId = window.setTimeout(() => {
        statusResetTimeoutId = 0;
        statusText.textContent = "";
      }, clearSavedStatusAfterMs);
    }
  }

  function syncWidthControls(widthPercent: unknown): void {
    const normalizedWidth = clampWidthPercent(widthPercent);
    const widthValue = String(normalizedWidth);

    widthRangeInput.value = widthValue;
    if (widthNumberInput) {
      widthNumberInput.value = widthValue;
    }
    widthOutput.value = `${normalizedWidth}%`;
  }

  let queuedPreviewWidth: number | null = null;
  let previewFrame = 0;

  function scheduleWidthPreview(widthPercent: number | null): void {
    queuedPreviewWidth = widthPercent;

    if (previewFrame) {
      return;
    }

    previewFrame = window.requestAnimationFrame(() => {
      previewFrame = 0;
      void saveLiveWidthPreview(queuedPreviewWidth);
    });
  }

  async function persistSettings(): Promise<void> {
    try {
      setStatus("Saving...");

      const savedSettings = await saveSettings({
        autoEnableMastodon: autoEnableMastodonInput.checked,
        autoEnableX: autoEnableXInput.checked,
        widthPercent: Number(widthRangeInput.value),
      });

      autoEnableMastodonInput.checked = savedSettings.autoEnableMastodon;
      autoEnableXInput.checked = savedSettings.autoEnableX;
      syncMasterAutoToggle();
      syncWidthControls(savedSettings.widthPercent);
      await saveLiveWidthPreview(null);
      setStatus("Saved");
    } catch (error) {
      console.error("Unable to save settings.", error);
      setStatus("Unable to save");
    }
  }

  async function loadInitialState(): Promise<void> {
    try {
      const settings = await loadSettings();
      autoEnableMastodonInput.checked = settings.autoEnableMastodon;
      autoEnableXInput.checked = settings.autoEnableX;
      syncMasterAutoToggle();
      syncWidthControls(settings.widthPercent);
      setStatus(initialStatusText ?? "Ready");
    } catch (error) {
      console.error("Unable to load settings.", error);
      setStatus("Unable to load");
    }
  }

  autoEnableInput.addEventListener("change", () => {
    const shouldEnableAll = autoEnableInput.indeterminate || autoEnableInput.checked;

    autoEnableInput.indeterminate = false;
    autoEnableInput.dataset.toggleState = shouldEnableAll ? "on" : "off";
    autoEnableInput.checked = shouldEnableAll;
    autoEnableMastodonInput.checked = shouldEnableAll;
    autoEnableXInput.checked = shouldEnableAll;
    void persistSettings();
  });

  autoEnableMastodonInput.addEventListener("change", () => {
    syncMasterAutoToggle();
    void persistSettings();
  });

  autoEnableXInput.addEventListener("change", () => {
    syncMasterAutoToggle();
    void persistSettings();
  });

  widthRangeInput.addEventListener("input", () => {
    syncWidthControls(widthRangeInput.value);
    scheduleWidthPreview(Number(widthRangeInput.value));
  });

  widthRangeInput.addEventListener("change", () => {
    void persistSettings();
  });

  window.addEventListener("pagehide", () => {
    if (statusResetTimeoutId) {
      window.clearTimeout(statusResetTimeoutId);
      statusResetTimeoutId = 0;
    }

    if (previewFrame) {
      window.cancelAnimationFrame(previewFrame);
      previewFrame = 0;
    }

    void saveLiveWidthPreview(null);
  });

  openOptionsButton?.addEventListener("click", () => {
    void getExtensionApi()?.runtime?.openOptionsPage?.();
  });

  void loadInitialState();
}
