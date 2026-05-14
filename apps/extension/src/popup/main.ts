import "./styles.css";
import { BUILD_ID } from "../shared/build-info";
import { mountSettingsScreen } from "../shared/ui/settings-screen";

document.querySelector<HTMLElement>("#build-id")!.textContent = `v${BUILD_ID}`;

mountSettingsScreen({
  autoEnableInput: document.querySelector<HTMLInputElement>("#auto-enable")!,
  autoEnableMastodonInput: document.querySelector<HTMLInputElement>("#auto-enable-mastodon")!,
  autoEnableXInput: document.querySelector<HTMLInputElement>("#auto-enable-x")!,
  widthRangeInput: document.querySelector<HTMLInputElement>("#width-range")!,
  widthOutput: document.querySelector<HTMLOutputElement>("#width-output")!,
  statusText: document.querySelector<HTMLElement>("#status-text")!,
  initialStatusText: "",
  clearSavedStatusAfterMs: 1200,
  openOptionsButton: document.querySelector<HTMLButtonElement>("#open-options"),
});
