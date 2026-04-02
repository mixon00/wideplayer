import "./styles.css";
import { mountSettingsScreen } from "../shared/ui/settings-screen";

mountSettingsScreen({
  autoEnableInput: document.querySelector<HTMLInputElement>("#auto-enable")!,
  widthRangeInput: document.querySelector<HTMLInputElement>("#width-range")!,
  widthNumberInput: document.querySelector<HTMLInputElement>("#width-input")!,
  widthOutput: document.querySelector<HTMLOutputElement>("#width-output")!,
  modeCopy: document.querySelector<HTMLElement>("#mode-copy")!,
  statusText: document.querySelector<HTMLElement>("#status-text")!,
  autoModeDescription: "Auto mode expands supported videos automatically.",
  manualModeDescription:
    "Manual mode disables automatic behavior and relies on per-video activation.",
});
