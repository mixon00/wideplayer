import "./styles.css";
import { BUILD_ID } from "../shared/build-info";
import { getExtensionApi } from "../shared/browser-api";
import { getCurrentPageStatusText } from "./page-status";

document.querySelector<HTMLElement>("#build-id")!.textContent = `v${BUILD_ID}`;

const pageStatus = document.querySelector<HTMLElement>("#page-status")!;
const openOptionsButton = document.querySelector<HTMLButtonElement>("#open-options")!;

openOptionsButton.addEventListener("click", () => {
  void getExtensionApi()?.runtime?.openOptionsPage?.();
});

void getCurrentPageStatusText().then((statusText) => {
  pageStatus.textContent = statusText;
});
