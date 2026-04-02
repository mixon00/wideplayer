import { getExtensionApi } from "../browser-api";
import { clampWidthPercent, loadSettings, saveSettings } from "../settings";

interface SettingsScreenElements {
  autoEnableInput: HTMLInputElement;
  widthRangeInput: HTMLInputElement;
  widthNumberInput: HTMLInputElement;
  widthOutput: HTMLOutputElement;
  modeCopy: HTMLElement;
  statusText: HTMLElement;
  autoModeDescription: string;
  manualModeDescription: string;
  openOptionsButton?: HTMLButtonElement | null;
}

export function mountSettingsScreen(elements: SettingsScreenElements): void {
  const {
    autoEnableInput,
    widthRangeInput,
    widthNumberInput,
    widthOutput,
    modeCopy,
    statusText,
    autoModeDescription,
    manualModeDescription,
    openOptionsButton,
  } = elements;

  function setStatus(message: string): void {
    statusText.textContent = message;
  }

  function updateModeCopy(autoEnable: boolean): void {
    modeCopy.textContent = autoEnable ? autoModeDescription : manualModeDescription;
  }

  function syncWidthControls(widthPercent: unknown): void {
    const normalizedWidth = clampWidthPercent(widthPercent);
    const widthValue = String(normalizedWidth);

    widthRangeInput.value = widthValue;
    widthNumberInput.value = widthValue;
    widthOutput.value = `${normalizedWidth}%`;
  }

  async function persistSettings(): Promise<void> {
    try {
      setStatus("Saving...");

      const savedSettings = await saveSettings({
        autoEnable: autoEnableInput.checked,
        widthPercent: Number(widthNumberInput.value),
      });

      autoEnableInput.checked = savedSettings.autoEnable;
      syncWidthControls(savedSettings.widthPercent);
      updateModeCopy(savedSettings.autoEnable);
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
      setStatus("Ready");
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
  });

  widthRangeInput.addEventListener("change", () => {
    void persistSettings();
  });

  widthNumberInput.addEventListener("change", () => {
    void persistSettings();
  });

  openOptionsButton?.addEventListener("click", () => {
    void getExtensionApi()?.runtime?.openOptionsPage?.();
  });

  void loadInitialState();
}
