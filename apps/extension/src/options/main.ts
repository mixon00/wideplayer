import "./styles.css";
import { BUILD_ID } from "../shared/build-info";
import { mountPlatformSettings } from "./platform-settings";
import { mountTabs } from "./tabs";

document.querySelector<HTMLElement>("#build-id")!.textContent = `v${BUILD_ID}`;

mountTabs({
  defaultTab: "settings",
  panels: Array.from(document.querySelectorAll<HTMLElement>("[data-tab-panel]")),
  tabs: Array.from(document.querySelectorAll<HTMLButtonElement>("[data-tab-target]")),
});

mountPlatformSettings({
  container: document.querySelector<HTMLElement>("#platform-settings")!,
  statusText: document.querySelector<HTMLElement>("#settings-status")!,
});
