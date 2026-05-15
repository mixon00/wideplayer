import { clampWidthPercent, loadSettings, saveLiveWidthPreview, saveSettings } from "../shared/settings";
import type { Settings, SupportedPlatform } from "../shared/constants";
import { PLATFORM_SETTINGS, type PlatformSettingsConfig } from "./platforms";

interface PlatformControls {
  autoEnableInput: HTMLInputElement;
  config: PlatformSettingsConfig;
  element: HTMLElement;
  isConfigurable: boolean;
  widthOutput: HTMLOutputElement;
  widthRangeInput: HTMLInputElement;
}

interface PlatformSettingsElements {
  container: HTMLElement;
  statusText: HTMLElement;
}

function isSupportedPreviewPlatform(platform: string): platform is SupportedPlatform {
  return platform === "mastodon" || platform === "x";
}

function setStatus(statusText: HTMLElement, message: string): void {
  statusText.textContent = message;
}

function syncWidthControl(control: PlatformControls, widthPercent: unknown): void {
  const normalizedWidth = clampWidthPercent(widthPercent);
  control.widthRangeInput.value = String(normalizedWidth);
  control.widthOutput.value = `${normalizedWidth}%`;
}

function createPlatformCard(config: PlatformSettingsConfig): PlatformControls {
  const card = document.createElement("article");
  card.className = "platform-card";
  card.dataset.platformStatus = config.status === "Supported" ? "supported" : "coming-soon";

  const header = document.createElement("div");
  header.className = "platform-card-header";

  const titleGroup = document.createElement("div");
  titleGroup.className = "platform-title-group";

  const title = document.createElement("h3");
  title.textContent = config.label;

  const description = document.createElement("p");
  description.textContent = config.description;

  const badge = document.createElement("span");
  badge.className = "platform-badge";
  badge.textContent = config.status;

  titleGroup.append(title, description);
  header.append(titleGroup, badge);

  const autoEnableInput = document.createElement("input");
  autoEnableInput.type = "checkbox";

  const widthOutput = document.createElement("output");
  const widthRangeInput = document.createElement("input");
  widthRangeInput.type = "range";

  if (config.status === "Supported") {
    const autoId = `auto-enable-${config.platform}`;
    const autoRow = document.createElement("label");
    autoRow.className = "setting-row";
    autoRow.htmlFor = autoId;

    const autoLabel = document.createElement("span");
    autoLabel.className = "setting-label";
    autoLabel.textContent = "Auto mode";

    autoEnableInput.id = autoId;
    autoRow.append(autoLabel, autoEnableInput);

    const widthId = `width-${config.platform}`;
    const widthGroup = document.createElement("div");
    widthGroup.className = "range-group";

    const rangeHeader = document.createElement("div");
    rangeHeader.className = "range-header";

    const widthLabel = document.createElement("label");
    widthLabel.className = "setting-label";
    widthLabel.htmlFor = widthId;
    widthLabel.textContent = "Width";

    widthOutput.htmlFor = widthId;
    widthRangeInput.id = widthId;
    widthRangeInput.min = "0";
    widthRangeInput.max = "100";
    widthRangeInput.step = "1";

    rangeHeader.append(widthLabel, widthOutput);
    widthGroup.append(rangeHeader, widthRangeInput);
    card.append(header, autoRow, widthGroup);
  } else {
    const note = document.createElement("p");
    note.className = "platform-note";
    note.textContent = "Controls will appear here when this platform is supported.";
    card.append(header, note);
  }

  return {
    autoEnableInput,
    config,
    element: card,
    isConfigurable: config.status === "Supported",
    widthOutput,
    widthRangeInput,
  };
}

export function mountPlatformSettings({ container, statusText }: PlatformSettingsElements): void {
  const controls = PLATFORM_SETTINGS.map(createPlatformCard);
  container.replaceChildren(...controls.map((control) => control.element));

  let queuedPreview: { platform: SupportedPlatform; widthPercent: number } | null = null;
  let previewFrame = 0;
  let statusResetTimeoutId = 0;

  function showSavedStatus(): void {
    if (statusResetTimeoutId) {
      window.clearTimeout(statusResetTimeoutId);
    }

    setStatus(statusText, "Saved");
    statusResetTimeoutId = window.setTimeout(() => {
      statusResetTimeoutId = 0;
      setStatus(statusText, "");
    }, 1400);
  }

  function syncControls(settings: Settings): void {
    for (const control of controls) {
      if (!control.isConfigurable) {
        continue;
      }

      control.autoEnableInput.checked = Boolean(settings[control.config.autoEnableKey]);
      syncWidthControl(control, settings[control.config.widthPercentKey]);
    }
  }

  function readControls(): Partial<Settings> {
    const nextSettings: Partial<Settings> = {};

    for (const control of controls) {
      if (!control.isConfigurable) {
        continue;
      }

      nextSettings[control.config.autoEnableKey] = control.autoEnableInput.checked as never;
      nextSettings[control.config.widthPercentKey] = Number(control.widthRangeInput.value) as never;
    }

    return nextSettings;
  }

  function scheduleWidthPreview(platform: string, widthPercent: number): void {
    if (!isSupportedPreviewPlatform(platform)) {
      return;
    }

    queuedPreview = { platform, widthPercent };

    if (previewFrame) {
      return;
    }

    previewFrame = window.requestAnimationFrame(() => {
      previewFrame = 0;
      void saveLiveWidthPreview(queuedPreview);
    });
  }

  async function persistSettings(): Promise<void> {
    try {
      setStatus(statusText, "Saving...");
      const savedSettings = await saveSettings(readControls());
      syncControls(savedSettings);
      await saveLiveWidthPreview(null);
      showSavedStatus();
    } catch (error) {
      console.error("Unable to save settings.", error);
      setStatus(statusText, "Unable to save");
    }
  }

  for (const control of controls) {
    if (!control.isConfigurable) {
      continue;
    }

    control.autoEnableInput.addEventListener("change", () => {
      void persistSettings();
    });

    control.widthRangeInput.addEventListener("input", () => {
      syncWidthControl(control, control.widthRangeInput.value);
      scheduleWidthPreview(control.config.platform, Number(control.widthRangeInput.value));
    });

    control.widthRangeInput.addEventListener("change", () => {
      void persistSettings();
    });
  }

  window.addEventListener("pagehide", () => {
    if (statusResetTimeoutId) {
      window.clearTimeout(statusResetTimeoutId);
    }

    if (previewFrame) {
      window.cancelAnimationFrame(previewFrame);
    }

    void saveLiveWidthPreview(null);
  });

  void loadSettings()
    .then((settings) => {
      syncControls(settings);
      setStatus(statusText, "");
    })
    .catch((error) => {
      console.error("Unable to load settings.", error);
      setStatus(statusText, "Unable to load");
    });
}
