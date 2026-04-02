import { contentStyles } from "./styles";
import {
  DEFAULT_SETTINGS,
  OVERLAY_ROOT_ID,
  STYLE_ELEMENT_ID,
  SUPPORTED_HOSTS,
  type Settings,
} from "../shared/constants";
import { loadSettings, subscribeToSettings } from "../shared/settings";

interface Candidate {
  article: HTMLElement;
  mediaContainer: HTMLElement | null;
  video: HTMLVideoElement;
}

class WidePlayerContentApp {
  private candidates = new Map<string, Candidate>();
  private mutationObserver: MutationObserver | null = null;
  private overlayRoot: HTMLElement | null = null;
  private scanQueued = false;
  private settings: Settings = DEFAULT_SETTINGS;
  private unsubscribe: (() => void) | null = null;
  private candidateSequence = 0;

  async init(): Promise<void> {
    if (!SUPPORTED_HOSTS.has(window.location.hostname)) {
      return;
    }

    this.injectStyles();
    this.settings = await loadSettings();
    this.overlayRoot = this.ensureOverlayRoot();
    this.applySettings();
    this.scanForCandidates();
    this.observeMutations();
    this.unsubscribe = subscribeToSettings((nextSettings) => {
      this.settings = nextSettings;
      this.applySettings();
      this.scanForCandidates();
    });

    window.addEventListener(
      "pagehide",
      () => {
        this.dispose();
      },
      { once: true }
    );
  }

  private applySettings(): void {
    document.documentElement.dataset.wideplayerMode = this.settings.autoEnable ? "auto" : "manual";
    document.documentElement.style.setProperty(
      "--wideplayer-width-percent",
      String(this.settings.widthPercent)
    );
  }

  private ensureOverlayRoot(): HTMLElement {
    let overlayRoot = document.getElementById(OVERLAY_ROOT_ID);

    if (!overlayRoot) {
      overlayRoot = document.createElement("div");
      overlayRoot.id = OVERLAY_ROOT_ID;
      document.body.appendChild(overlayRoot);
    }

    return overlayRoot;
  }

  private injectStyles(): void {
    if (document.getElementById(STYLE_ELEMENT_ID)) {
      return;
    }

    const styleElement = document.createElement("style");
    styleElement.id = STYLE_ELEMENT_ID;
    styleElement.textContent = contentStyles;
    document.head.appendChild(styleElement);
  }

  private observeMutations(): void {
    this.mutationObserver = new MutationObserver(() => {
      this.scheduleScan();
    });

    this.mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  private scheduleScan(): void {
    if (this.scanQueued) {
      return;
    }

    this.scanQueued = true;

    window.requestAnimationFrame(() => {
      this.scanQueued = false;
      this.scanForCandidates();
    });
  }

  private scanForCandidates(): void {
    const seenCandidateIds = new Set<string>();
    const videos = document.querySelectorAll<HTMLVideoElement>("article video");

    for (const video of videos) {
      const article = video.closest<HTMLElement>("article");

      if (!article) {
        continue;
      }

      const candidateId = this.registerCandidate(article, video);
      seenCandidateIds.add(candidateId);
    }

    for (const [candidateId, candidate] of this.candidates.entries()) {
      if (seenCandidateIds.has(candidateId) && candidate.article.isConnected) {
        continue;
      }

      candidate.article.removeAttribute("data-wideplayer-candidate");
      candidate.article.removeAttribute("data-wideplayer-mode");
      candidate.article.removeAttribute("data-wideplayer-candidate-id");
      candidate.mediaContainer?.classList.remove("wideplayer-media-anchor");
      candidate.mediaContainer?.style.removeProperty("--wideplayer-target-width");
      this.candidates.delete(candidateId);
    }
  }

  private registerCandidate(article: HTMLElement, video: HTMLVideoElement): string {
    const existingId = article.dataset.wideplayerCandidateId;
    const candidateId = existingId ?? `wideplayer-${++this.candidateSequence}`;
    const mediaContainer = this.findMediaContainer(video);

    article.dataset.wideplayerCandidateId = candidateId;
    article.dataset.wideplayerCandidate = "true";
    article.dataset.wideplayerMode = this.settings.autoEnable ? "auto" : "manual";

    if (mediaContainer) {
      mediaContainer.classList.add("wideplayer-media-anchor");
      mediaContainer.style.setProperty("--wideplayer-target-width", `${this.settings.widthPercent}%`);
    }

    this.candidates.set(candidateId, {
      article,
      mediaContainer,
      video,
    });

    return candidateId;
  }

  private findMediaContainer(video: HTMLVideoElement): HTMLElement | null {
    return (
      video.closest<HTMLElement>("[data-testid='videoPlayer']") ??
      video.closest<HTMLElement>("[data-testid='cellInnerDiv']") ??
      video.parentElement
    );
  }

  private dispose(): void {
    this.mutationObserver?.disconnect();
    this.unsubscribe?.();
    this.candidates.clear();
    this.overlayRoot?.remove();

    const styleElement = document.getElementById(STYLE_ELEMENT_ID);
    styleElement?.remove();
  }
}

const app = new WidePlayerContentApp();
void app.init();
