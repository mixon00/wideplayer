import "./styles.css";
import { BUILD_ID } from "../shared/build-info";
import { mountSettingsScreen } from "../shared/ui/settings-screen";

document.querySelector<HTMLElement>("#build-id")!.textContent = `Build ${BUILD_ID}`;

mountSettingsScreen({
  autoEnableInput: document.querySelector<HTMLInputElement>("#auto-enable")!,
  widthRangeInput: document.querySelector<HTMLInputElement>("#width-range")!,
  widthOutput: document.querySelector<HTMLOutputElement>("#width-output")!,
  modeCopy: document.querySelector<HTMLElement>("#mode-copy")!,
  statusText: document.querySelector<HTMLElement>("#status-text")!,
  autoModeDescription: "Auto mode expands supported videos automatically.",
  manualModeDescription:
    "Manual mode keeps auto expansion off and prepares per-video controls.",
  openOptionsButton: document.querySelector<HTMLButtonElement>("#open-options"),
});
