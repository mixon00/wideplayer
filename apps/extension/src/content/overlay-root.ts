import { OVERLAY_ROOT_ID } from "../shared/constants";
import type { OverlayFrameElements } from "./types";

type OverlayRootPlacement = {
  host: HTMLElement;
  insertBefore: HTMLElement | null;
  layeredMain: HTMLElement | null;
};

export class OverlayRootManager {
  private layeredMain: HTMLElement | null = null;
  private root: HTMLElement;

  constructor() {
    this.root = this.ensureRoot();
  }

  createFrame(candidateId: string): OverlayFrameElements {
    this.root = this.ensureRoot();

    const frame = document.createElement("div");
    frame.className = "wideplayer-overlay-frame";
    frame.dataset.wideplayerCandidateId = candidateId;

    const surface = document.createElement("div");
    surface.className = "wideplayer-overlay-surface";

    frame.appendChild(surface);
    this.root.appendChild(frame);

    return { frame, surface };
  }

  destroy(): void {
    this.root.remove();
    this.syncLayeredMain(null);
  }

  removeFrame(frame: HTMLElement): void {
    frame.remove();
  }

  private ensureRoot(): HTMLElement {
    const placement = this.resolvePlacement();
    const { host, insertBefore, layeredMain } = placement;
    let root = document.getElementById(OVERLAY_ROOT_ID);

    if (!root) {
      root = document.createElement("div");
      root.id = OVERLAY_ROOT_ID;
    }

    this.syncLayeredMain(layeredMain);

    if (root.parentElement !== host) {
      if (insertBefore) {
        host.insertBefore(root, insertBefore);
      } else {
        host.appendChild(root);
      }
    } else if (insertBefore && root !== insertBefore && root.nextElementSibling !== insertBefore) {
      host.insertBefore(root, insertBefore);
    }

    return root;
  }

  private findPrimaryColumnHost(reactRoot: HTMLElement): OverlayRootPlacement | null {
    const primaryColumn = reactRoot.querySelector<HTMLElement>("[data-testid='primaryColumn']");
    const mainElement = reactRoot.querySelector<HTMLElement>("main[role='main'], main");

    if (!primaryColumn) {
      return null;
    }

    const host =
      primaryColumn.firstElementChild instanceof HTMLElement
        ? primaryColumn.firstElementChild
        : primaryColumn;
    const insertBefore =
      Array.from(host.children).find((element) =>
        element instanceof HTMLElement
          ? window.getComputedStyle(element).position === "sticky"
          : false
      ) ?? null;

    return {
      host,
      insertBefore: insertBefore instanceof HTMLElement ? insertBefore : null,
      layeredMain: mainElement ?? null,
    };
  }

  private findMastodonHost(): OverlayRootPlacement | null {
    const mastodonRoot =
      document.querySelector<HTMLElement>("#mastodon") ??
      (document.body.matches("#mastodon") ? document.body : null);

    if (!mastodonRoot) {
      return null;
    }

    return {
      host: mastodonRoot,
      insertBefore: null,
      layeredMain: null,
    };
  }

  private resolvePlacement(): OverlayRootPlacement {
    const reactRoot = document.getElementById("react-root");

    if (reactRoot instanceof HTMLElement) {
      return (
        this.findPrimaryColumnHost(reactRoot) ?? {
          host: reactRoot,
          insertBefore: null,
          layeredMain: null,
        }
      );
    }

    const mastodonPlacement = this.findMastodonHost();

    if (mastodonPlacement) {
      return mastodonPlacement;
    }

    return {
      host: document.body,
      insertBefore: null,
      layeredMain: null,
    };
  }

  private syncLayeredMain(nextMain: HTMLElement | null): void {
    if (this.layeredMain && this.layeredMain !== nextMain) {
      this.layeredMain.removeAttribute("data-wideplayer-overlay-layer");
    }

    if (nextMain) {
      nextMain.setAttribute("data-wideplayer-overlay-layer", "true");
    }

    this.layeredMain = nextMain;
  }
}
