import "./styles.css";
import { BUILD_ID } from "../shared/build-info";
import { getExtensionApi } from "../shared/browser-api";
import { loadSettings, saveSettings } from "../shared/settings";
import { getCurrentPageStatusText } from "./page-status";

document.querySelector<HTMLElement>("#build-id")!.textContent = `v${BUILD_ID}`;

const pageStatus = document.querySelector<HTMLElement>("#page-status")!;
const openOptionsButton = document.querySelector<HTMLButtonElement>("#open-options")!;
const platformToggles = Array.from(
  document.querySelectorAll<HTMLInputElement>("[data-platform-toggle]")
);

openOptionsButton.addEventListener("click", () => {
  void getExtensionApi()?.runtime?.openOptionsPage?.();
});

void getCurrentPageStatusText().then((statusText) => {
  pageStatus.textContent = statusText;
});

void loadSettings().then((settings) => {
  for (const toggle of platformToggles) {
    const platform = toggle.dataset.platformToggle;

    if (platform === "x") {
      toggle.checked = settings.platformEnabledX;
    }

    if (platform === "mastodon") {
      toggle.checked = settings.platformEnabledMastodon;
    }
  }
});

for (const toggle of platformToggles) {
  toggle.addEventListener("change", () => {
    const platform = toggle.dataset.platformToggle;

    if (platform === "x") {
      void saveSettings({ platformEnabledX: toggle.checked });
    }

    if (platform === "mastodon") {
      void saveSettings({ platformEnabledMastodon: toggle.checked });
    }
  });
}
