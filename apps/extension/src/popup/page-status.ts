import { getExtensionApi, getRuntimeErrorMessage, type Tab } from "../shared/browser-api";
import type { SupportedPlatform } from "../shared/constants";

interface PageStatusResponse {
  platform: SupportedPlatform | null;
}

function isPageStatusResponse(input: unknown): input is PageStatusResponse {
  if (typeof input !== "object" || input === null) {
    return false;
  }

  const platform = (input as PageStatusResponse).platform;
  return platform === null || platform === "mastodon" || platform === "x";
}

function queryActiveTab(): Promise<Tab | null> {
  const tabs = getExtensionApi()?.tabs;

  if (!tabs?.query) {
    return Promise.resolve(null);
  }

  return new Promise((resolve) => {
    const result = tabs.query({ active: true, currentWindow: true }, (queriedTabs: Tab[]) => {
      resolve(queriedTabs[0] ?? null);
    });

    if (result && typeof (result as Promise<Tab[]>).then === "function") {
      void (result as Promise<Tab[]>).then((queriedTabs) => {
        resolve(queriedTabs[0] ?? null);
      });
    }
  });
}

function sendPageStatusMessage(tabId: number): Promise<PageStatusResponse | null> {
  const tabs = getExtensionApi()?.tabs;

  if (!tabs?.sendMessage) {
    return Promise.resolve(null);
  }

  const sendMessage = tabs.sendMessage;

  return new Promise((resolve) => {
    const result = sendMessage(
      tabId,
      { type: "wideplayer:get-page-status" },
      (response: unknown) => {
        if (getRuntimeErrorMessage()) {
          resolve(null);
          return;
        }

        resolve(isPageStatusResponse(response) ? response : null);
      }
    );

    if (result && typeof (result as Promise<unknown>).then === "function") {
      void (result as Promise<unknown>)
        .then((response) => {
          resolve(isPageStatusResponse(response) ? response : null);
        })
        .catch(() => {
          resolve(null);
        });
    }
  });
}

export async function getCurrentPageStatusText(): Promise<string> {
  const activeTab = await queryActiveTab();

  if (!activeTab?.id) {
    return "Open settings to configure WidePlayer.";
  }

  const pageStatus = await sendPageStatusMessage(activeTab.id);

  if (pageStatus?.platform === "x") {
    return "X is supported here.";
  }

  if (pageStatus?.platform === "mastodon") {
    return "Mastodon is supported here.";
  }

  return "No supported platform detected.";
}
