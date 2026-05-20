import { clampWidthPercent, loadSettings, saveLiveWidthPreview, saveSettings } from "../shared/settings";
import type { Settings, SupportedPlatform } from "../shared/constants";
import { PLATFORM_SETTINGS, type PlatformSettingsConfig } from "./platforms";

interface PlatformControls {
  autoEnableInput: HTMLInputElement;
  autoStatus: HTMLElement | null;
  config: PlatformSettingsConfig;
  element: HTMLElement;
  isConfigurable: boolean;
  platformEnabledInput: HTMLInputElement | null;
  platformEnabledStatus: HTMLElement | null;
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
  control.widthRangeInput.style.setProperty("--range-value", `${normalizedWidth}%`);
  control.widthOutput.value = `${normalizedWidth}%`;
}

function syncPlatformEnabledControl(control: PlatformControls, isEnabled: boolean): void {
  control.element.dataset.platformEnabled = String(isEnabled);

  if (control.platformEnabledInput) {
    control.platformEnabledInput.checked = isEnabled;
  }

  if (control.platformEnabledStatus) {
    control.platformEnabledStatus.textContent = isEnabled ? "On" : "Off";
  }

  if (!control.isConfigurable) {
    return;
  }

  control.autoEnableInput.disabled = !isEnabled;
  control.widthRangeInput.disabled = !isEnabled;
  control.widthOutput.setAttribute("aria-disabled", String(!isEnabled));
}

function syncAutoEnableControl(control: PlatformControls, isEnabled: boolean): void {
  control.autoEnableInput.checked = isEnabled;

  if (control.autoStatus) {
    control.autoStatus.textContent = isEnabled ? "On" : "Off";
  }
}

function createPlatformCard(config: PlatformSettingsConfig): PlatformControls {
  const card = document.createElement("article");
  card.className = "platform-card";
  card.dataset.platformStatus = config.status === "Supported" ? "supported" : "coming-soon";

  const header = document.createElement("div");
  header.className = "platform-card-header";

  const titleGroup = document.createElement("div");
  titleGroup.className = "platform-title-group";

  const titleRow = document.createElement("div");
  titleRow.className = "platform-title-row";

  const icon = document.createElement("img");
  icon.className = "platform-icon";
  icon.src = config.iconSrc;
  icon.width = 24;
  icon.height = 24;
  icon.alt = "";
  icon.setAttribute("aria-hidden", "true");

  const title = document.createElement("h3");
  title.textContent = config.label;

  const description = document.createElement("p");
  description.textContent = config.description;

  const titleCopy = document.createElement("div");
  titleCopy.className = "platform-title-copy";
  titleCopy.append(title, description);

  titleRow.append(icon, titleCopy);
  titleGroup.append(titleRow);
  header.append(titleGroup);

  if (config.status !== "Supported") {
    const badge = document.createElement("span");
    badge.className = "platform-badge";
    badge.textContent = config.status;
    header.append(badge);
  }

  const autoEnableInput = document.createElement("input");
  autoEnableInput.type = "checkbox";
  let platformEnabledInput: HTMLInputElement | null = null;
  let platformEnabledStatus: HTMLElement | null = null;
  let autoStatus: HTMLElement | null = null;

  const widthOutput = document.createElement("output");
  const widthRangeInput = document.createElement("input");
  widthRangeInput.type = "range";

  if (config.status === "Supported") {
    platformEnabledInput = document.createElement("input");
    platformEnabledInput.type = "checkbox";
    platformEnabledInput.id = `platform-enabled-${config.platform}`;

    const platformEnabledLabel = document.createElement("label");
    platformEnabledLabel.className = "platform-enabled-toggle";
    platformEnabledLabel.htmlFor = platformEnabledInput.id;
    platformEnabledLabel.setAttribute("aria-label", `Enable ${config.label}`);
    platformEnabledLabel.append(platformEnabledInput);

    platformEnabledStatus = document.createElement("span");
    platformEnabledStatus.className = "toggle-state";

    const platformEnabledControl = document.createElement("div");
    platformEnabledControl.className = "platform-enable-control";

    const platformEnabledText = document.createElement("span");
    platformEnabledText.className = "setting-label";
    platformEnabledText.textContent = "Enabled";

    platformEnabledControl.append(platformEnabledText, platformEnabledLabel, platformEnabledStatus);
    header.append(platformEnabledControl);

    const autoId = `auto-enable-${config.platform}`;
    const autoRow = document.createElement("label");
    autoRow.className = "setting-row";
    autoRow.htmlFor = autoId;

    const autoLabel = document.createElement("span");
    autoLabel.className = "setting-label";
    autoLabel.textContent = "Auto mode";

    const autoDescription = document.createElement("span");
    autoDescription.className = "setting-description";
    autoDescription.textContent = "Automatically open supported videos in wide mode.";

    const autoText = document.createElement("span");
    autoText.className = "setting-text";
    autoText.append(autoLabel, autoDescription);

    const autoToggleLabel = document.createElement("span");
    autoToggleLabel.className = "setting-toggle";
    autoToggleLabel.append(autoEnableInput);

    autoStatus = document.createElement("span");
    autoStatus.className = "toggle-state";

    const autoControl = document.createElement("span");
    autoControl.className = "setting-control";
    autoControl.append(autoToggleLabel, autoStatus);

    autoEnableInput.id = autoId;
    autoRow.append(autoText, autoControl);

    const widthId = `width-${config.platform}`;
    const widthGroup = document.createElement("div");
    widthGroup.className = "range-group";

    const widthText = document.createElement("div");
    widthText.className = "setting-text";

    const widthLabel = document.createElement("label");
    widthLabel.className = "setting-label";
    widthLabel.htmlFor = widthId;
    widthLabel.textContent = "Preferred width";

    const widthDescription = document.createElement("span");
    widthDescription.className = "setting-description";
    widthDescription.textContent = "Set your preferred width for videos.";

    widthOutput.htmlFor = widthId;
    widthOutput.className = "width-output";
    widthRangeInput.id = widthId;
    widthRangeInput.min = "0";
    widthRangeInput.max = "100";
    widthRangeInput.step = "1";

    widthText.append(widthLabel, widthDescription);
    widthGroup.append(widthText, widthRangeInput, widthOutput);
    card.append(header, autoRow, widthGroup);
  } else {
    const separator = document.createElement("div");
    separator.className = "platform-divider";

    const noteIcon = document.createElement("span");
    noteIcon.className = "platform-note-icon";
    noteIcon.textContent = "✦";
    noteIcon.setAttribute("aria-hidden", "true");

    const note = document.createElement("p");
    note.className = "platform-note";
    note.textContent = "Controls will appear here when this platform is supported.";

    const noteRow = document.createElement("div");
    noteRow.className = "platform-note-row";
    noteRow.append(noteIcon, note);
    card.append(header, separator, noteRow);
  }

  return {
    autoEnableInput,
    autoStatus,
    config,
    element: card,
    isConfigurable: config.status === "Supported",
    platformEnabledInput,
    platformEnabledStatus,
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
      if (control.config.platformEnabledKey) {
        syncPlatformEnabledControl(control, Boolean(settings[control.config.platformEnabledKey]));
      }

      if (!control.isConfigurable) {
        continue;
      }

      syncAutoEnableControl(control, Boolean(settings[control.config.autoEnableKey]));
      syncWidthControl(control, settings[control.config.widthPercentKey]);
    }
  }

  function readControls(): Partial<Settings> {
    const nextSettings: Partial<Settings> = {};

    for (const control of controls) {
      if (control.config.platformEnabledKey && control.platformEnabledInput) {
        nextSettings[control.config.platformEnabledKey] = control.platformEnabledInput.checked as never;
      }

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
    if (control.platformEnabledInput) {
      control.platformEnabledInput.addEventListener("change", () => {
        syncPlatformEnabledControl(control, Boolean(control.platformEnabledInput?.checked));
        void persistSettings();
      });
    }

    if (!control.isConfigurable) {
      continue;
    }

    control.autoEnableInput.addEventListener("change", () => {
      syncAutoEnableControl(control, control.autoEnableInput.checked);
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
