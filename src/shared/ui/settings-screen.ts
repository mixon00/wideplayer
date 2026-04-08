import { getExtensionApi } from "../browser-api";
import {
  clampWidthPercent,
  loadSettings,
  saveLiveWidthPreview,
  saveSettings,
} from "../settings";

interface SettingsScreenElements {
  autoEnableInput: HTMLInputElement;
  widthRangeInput: HTMLInputElement;
  widthOutput: HTMLOutputElement;
  widthNumberInput?: HTMLInputElement | null;
  modeCopy?: HTMLElement | null;
  statusText: HTMLElement;
  autoModeDescription: string;
  manualModeDescription: string;
  initialStatusText?: string;
  clearSavedStatusAfterMs?: number;
  openOptionsButton?: HTMLButtonElement | null;
}

export function mountSettingsScreen(elements: SettingsScreenElements): void {
  const {
    autoEnableInput,
    widthRangeInput,
    widthOutput,
    widthNumberInput,
    modeCopy,
    statusText,
    autoModeDescription,
    manualModeDescription,
    initialStatusText,
    clearSavedStatusAfterMs,
    openOptionsButton,
  } = elements;

  let statusResetTimeoutId = 0;

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

  function updateModeCopy(autoEnable: boolean): void {
    if (!modeCopy) {
      return;
    }

    modeCopy.textContent = autoEnable ? autoModeDescription : manualModeDescription;
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
        autoEnable: autoEnableInput.checked,
        widthPercent: Number(widthRangeInput.value),
      });

      autoEnableInput.checked = savedSettings.autoEnable;
      syncWidthControls(savedSettings.widthPercent);
      updateModeCopy(savedSettings.autoEnable);
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
      autoEnableInput.checked = settings.autoEnable;
      syncWidthControls(settings.widthPercent);
      updateModeCopy(settings.autoEnable);
      setStatus(initialStatusText ?? "Ready");
    } catch (error) {
      console.error("Unable to load settings.", error);
      setStatus("Unable to load");
    }
  }

  autoEnableInput.addEventListener("change", () => {
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
