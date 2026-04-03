import { OVERLAY_ROOT_ID } from "../shared/constants";
import type { OverlayFrameElements } from "./types";

export class OverlayRootManager {
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
    this.root = this.ensureRoot();
    this.root.remove();
  }

  removeFrame(frame: HTMLElement): void {
    frame.remove();
  }

  private ensureRoot(): HTMLElement {
    const host = this.resolveHost();
    let root = document.getElementById(OVERLAY_ROOT_ID);

    if (!root) {
      root = document.createElement("div");
      root.id = OVERLAY_ROOT_ID;
    }

    if (root.parentElement !== host) {
      host.appendChild(root);
    }

    return root;
  }

  private resolveHost(): HTMLElement {
    const reactRoot = document.getElementById("react-root");

    if (reactRoot instanceof HTMLElement) {
      return reactRoot;
    }

    return document.body;
  }
}
