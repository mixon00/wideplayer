import { DEFAULT_SETTINGS, STYLE_ELEMENT_ID, SUPPORTED_HOSTS, type Settings } from "../shared/constants";
import { loadSettings, subscribeToSettings } from "../shared/settings";
import { detectFeedVideoCandidates } from "./detector";
import { OverlayRootManager } from "./overlay-root";
import {
  activatePlayerPlacement,
  restorePlayerPlacement,
  updatePlaceholderHeight,
} from "./player-placement";
import { contentStyles } from "./styles";
import type { CandidateElements, CandidateRecord, RectSnapshot } from "./types";

const VIEWPORT_GUTTER = 16;
const VISIBILITY_THRESHOLD = 0.2;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function isFiniteNumber(value: number | undefined): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isPositiveNumber(value: number | undefined): value is number {
  return isFiniteNumber(value) && value > 0;
}

function firstFinite(...values: Array<number | undefined>): number | null {
  for (const value of values) {
    if (isFiniteNumber(value)) {
      return value;
    }
  }

  return null;
}

function firstPositive(...values: Array<number | undefined>): number | null {
  for (const value of values) {
    if (isPositiveNumber(value)) {
      return value;
    }
  }

  return null;
}

function isElementVisible(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();

  if (rect.width <= 0 || rect.height <= 0) {
    return false;
  }

  const visibleTop = Math.max(0, rect.top);
  const visibleBottom = Math.min(window.innerHeight, rect.bottom);
  const visibleHeight = Math.max(0, visibleBottom - visibleTop);

  return visibleHeight >= rect.height * VISIBILITY_THRESHOLD;
}

class WidePlayerContentApp {
  private readonly candidates = new Map<HTMLElement, CandidateRecord>();
  private readonly handlePageHide = (): void => {
    this.dispose();
  };
  private readonly handleScrollOrResize = (): void => {
    if (!this.intersectionObserver && this.settings.autoEnable) {
      this.syncFallbackVisibility();
      this.syncAutoMode();
    }

    if (this.hasActiveCandidates()) {
      this.schedulePositionSync();
    }
  };
  private readonly handleVisibilityChange = (entries: IntersectionObserverEntry[]): void => {
    for (const entry of entries) {
      const record = this.candidates.get(entry.target as HTMLElement);

      if (!record) {
        continue;
      }

      record.isVisible =
        entry.isIntersecting && entry.intersectionRatio >= VISIBILITY_THRESHOLD;
    }

    if (this.settings.autoEnable) {
      this.syncAutoMode();
    }

    if (this.hasActiveCandidates()) {
      this.schedulePositionSync();
    }
  };

  private candidateSequence = 0;
  private intersectionObserver: IntersectionObserver | null = null;
  private mutationObserver: MutationObserver | null = null;
  private overlayRootManager: OverlayRootManager | null = null;
  private scanQueued = false;
  private settings: Settings = DEFAULT_SETTINGS;
  private syncQueued = false;
  private unsubscribe: (() => void) | null = null;

  async init(): Promise<void> {
    if (!SUPPORTED_HOSTS.has(window.location.hostname)) {
      return;
    }

    if (!document.body || !document.head) {
      return;
    }

    this.injectStyles();
    this.overlayRootManager = new OverlayRootManager();
    this.settings = await loadSettings();
    this.applySettings();
    this.createIntersectionObserver();
    this.observeMutations();
    this.scanForCandidates();
    this.unsubscribe = subscribeToSettings(async (nextSettings) => {
      this.handleSettingsChange(nextSettings);
    });

    window.addEventListener("scroll", this.handleScrollOrResize, { passive: true });
    window.addEventListener("resize", this.handleScrollOrResize);
    window.addEventListener("pagehide", this.handlePageHide, { once: true });
  }

  private activateCandidate(record: CandidateRecord): void {
    if (record.activePlacement || !this.overlayRootManager) {
      this.updateToggleButtonState(record);
      return;
    }

    record.lastKnownAspectRatio = this.resolveAspectRatio(record);

    const overlayFrame = this.overlayRootManager.createFrame(record.id);
    const activePlacement = activatePlayerPlacement(
      record.playerElement,
      record.anchorElement,
      record.id,
      overlayFrame
    );

    if (!activePlacement) {
      this.overlayRootManager.removeFrame(overlayFrame.frame);
      this.updateToggleButtonState(record);
      return;
    }

    record.activePlacement = activePlacement;
    record.article.dataset.wideplayerState = "expanded";
    record.playerElement.dataset.wideplayerExpanded = "true";
    this.updateToggleButtonState(record);
    this.syncCandidatePosition(record);
    this.schedulePositionSync();
  }

  private applySettings(): void {
    document.documentElement.dataset.wideplayerMode = this.settings.autoEnable ? "auto" : "manual";
    document.documentElement.style.setProperty(
      "--wideplayer-width-percent",
      String(this.settings.widthPercent)
    );
  }

  private collapseAll(): void {
    for (const record of this.candidates.values()) {
      this.deactivateCandidate(record);
    }
  }

  private createCandidate(elements: CandidateElements): CandidateRecord {
    const record: CandidateRecord = {
      ...elements,
      activePlacement: null,
      handleToggleClick: (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.toggleCandidate(record);
      },
      id: `wideplayer-${++this.candidateSequence}`,
      isVisible: this.intersectionObserver ? false : isElementVisible(elements.article),
      lastKnownAspectRatio: null,
      toggleButton: null,
    };

    record.article.dataset.wideplayerCandidate = "true";
    record.article.dataset.wideplayerCandidateId = record.id;
    record.article.dataset.wideplayerMode = this.settings.autoEnable ? "auto" : "manual";
    record.article.dataset.wideplayerState = "collapsed";
    record.playerElement.classList.add("wideplayer-player-root");
    this.intersectionObserver?.observe(record.article);
    this.candidates.set(record.article, record);
    this.syncToggleButton(record);

    return record;
  }

  private createIntersectionObserver(): void {
    if (typeof IntersectionObserver === "undefined") {
      this.intersectionObserver = null;
      return;
    }

    this.intersectionObserver = new IntersectionObserver(this.handleVisibilityChange, {
      threshold: [0, VISIBILITY_THRESHOLD, 0.5, 1],
    });
  }

  private deactivateCandidate(record: CandidateRecord): void {
    const activePlacement = record.activePlacement;

    if (!activePlacement) {
      this.updateToggleButtonState(record);
      return;
    }

    try {
      restorePlayerPlacement(activePlacement);
    } finally {
      this.overlayRootManager?.removeFrame(activePlacement.frame);
      record.activePlacement = null;
      delete record.playerElement.dataset.wideplayerExpanded;
      record.article.dataset.wideplayerState = "collapsed";
      this.updateToggleButtonState(record);
    }
  }

  private destroyCandidate(record: CandidateRecord): void {
    this.deactivateCandidate(record);
    this.removeToggleButton(record);
    this.intersectionObserver?.unobserve(record.article);
    record.playerElement.classList.remove("wideplayer-player-root");
    delete record.playerElement.dataset.wideplayerExpanded;
    record.article.removeAttribute("data-wideplayer-candidate");
    record.article.removeAttribute("data-wideplayer-candidate-id");
    record.article.removeAttribute("data-wideplayer-mode");
    record.article.removeAttribute("data-wideplayer-state");
    this.candidates.delete(record.article);
  }

  private handleSettingsChange(nextSettings: Settings): void {
    const modeChanged = this.settings.autoEnable !== nextSettings.autoEnable;

    this.settings = nextSettings;
    this.applySettings();

    if (modeChanged) {
      this.collapseAll();
    }

    this.scanForCandidates();

    if (!modeChanged && this.hasActiveCandidates()) {
      this.schedulePositionSync();
    }
  }

  private hasActiveCandidates(): boolean {
    for (const record of this.candidates.values()) {
      if (record.activePlacement) {
        return true;
      }
    }

    return false;
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

  private removeToggleButton(record: CandidateRecord): void {
    if (!record.toggleButton) {
      return;
    }

    record.toggleButton.removeEventListener("click", record.handleToggleClick);
    record.toggleButton.remove();
    record.toggleButton = null;
  }

  private ensureActivePlacementConnection(record: CandidateRecord): boolean {
    const activePlacement = record.activePlacement;

    if (!activePlacement || !this.overlayRootManager) {
      return false;
    }

    const isFrameConnected = activePlacement.frame.isConnected;
    const isPlayerMounted = activePlacement.mountedElement.parentElement === activePlacement.surface;

    if (isFrameConnected && isPlayerMounted) {
      return true;
    }

    const overlayFrame = this.overlayRootManager.createFrame(record.id);
    overlayFrame.surface.appendChild(activePlacement.mountedElement);
    if (activePlacement.overlayRadius) {
      overlayFrame.frame.style.borderTopLeftRadius = activePlacement.overlayRadius.topLeft;
      overlayFrame.frame.style.borderTopRightRadius = activePlacement.overlayRadius.topRight;
      overlayFrame.frame.style.borderBottomRightRadius = activePlacement.overlayRadius.bottomRight;
      overlayFrame.frame.style.borderBottomLeftRadius = activePlacement.overlayRadius.bottomLeft;
    }
    activePlacement.frame = overlayFrame.frame;
    activePlacement.surface = overlayFrame.surface;

    return true;
  }

  private resolveAspectRatio(record: CandidateRecord): number {
    if (record.video.videoWidth > 0 && record.video.videoHeight > 0) {
      const videoAspectRatio = record.video.videoWidth / record.video.videoHeight;
      record.lastKnownAspectRatio = videoAspectRatio;
      return videoAspectRatio;
    }

    const playerRect = record.playerElement.getBoundingClientRect();

    if (playerRect.width > 0 && playerRect.height > 0) {
      const playerAspectRatio = playerRect.width / playerRect.height;
      record.lastKnownAspectRatio = playerAspectRatio;
      return playerAspectRatio;
    }

    return record.lastKnownAspectRatio ?? 16 / 9;
  }

  private scanForCandidates(): void {
    const detectedCandidates = detectFeedVideoCandidates(document);
    const seenArticles = new Set<HTMLElement>();

    for (const elements of detectedCandidates) {
      const existingRecord = this.candidates.get(elements.article);

      seenArticles.add(elements.article);

      if (existingRecord) {
        this.updateCandidate(existingRecord, elements);
        continue;
      }

      this.createCandidate(elements);
    }

    for (const record of this.candidates.values()) {
      const shouldKeepActiveCandidate =
        Boolean(record.activePlacement) &&
        record.article.isConnected &&
        Boolean(record.activePlacement?.placeholder.isConnected);

      if (seenArticles.has(record.article) || shouldKeepActiveCandidate) {
        continue;
      }

      this.destroyCandidate(record);
    }

    if (!this.intersectionObserver && this.settings.autoEnable) {
      this.syncFallbackVisibility();
    }

    this.syncAutoMode();

    if (this.hasActiveCandidates()) {
      this.schedulePositionSync();
    }
  }

  private schedulePositionSync(): void {
    if (this.syncQueued) {
      return;
    }

    this.syncQueued = true;

    window.requestAnimationFrame(() => {
      this.syncQueued = false;
      this.syncPositions();
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

  private syncAutoMode(): void {
    for (const record of this.candidates.values()) {
      record.article.dataset.wideplayerMode = this.settings.autoEnable ? "auto" : "manual";
      this.syncToggleButton(record);

      if (!this.settings.autoEnable) {
        continue;
      }

      if (record.isVisible) {
        this.activateCandidate(record);
      } else {
        this.deactivateCandidate(record);
      }
    }
  }

  private resolveAnchorRect(record: CandidateRecord): RectSnapshot | null {
    const activePlacement = record.activePlacement;

    if (!activePlacement) {
      return null;
    }

    const placeholderRect = activePlacement.placeholder.getBoundingClientRect();
    const placeholderParent = activePlacement.placeholder.parentElement ?? activePlacement.originalParent;
    const parentRect = placeholderParent.getBoundingClientRect();
    const lastKnownAnchorRect = activePlacement.lastKnownAnchorRect;
    const width = firstPositive(
      placeholderRect.width,
      parentRect.width,
      lastKnownAnchorRect.width
    );
    const height = firstPositive(
      placeholderRect.height,
      parentRect.height,
      lastKnownAnchorRect.height
    );
    const left = firstFinite(placeholderRect.left, parentRect.left, lastKnownAnchorRect.left);
    const top = firstFinite(placeholderRect.top, parentRect.top, lastKnownAnchorRect.top);

    if (width === null || height === null || left === null || top === null) {
      return null;
    }

    const anchorRect = {
      height,
      left,
      top,
      width,
    };

    activePlacement.lastKnownAnchorRect = anchorRect;
    return anchorRect;
  }

  private syncCandidatePosition(record: CandidateRecord): void {
    const activePlacement = record.activePlacement;

    if (!activePlacement) {
      return;
    }

    if (!record.article.isConnected || !activePlacement.placeholder.isConnected) {
      this.destroyCandidate(record);
      return;
    }

    if (!this.ensureActivePlacementConnection(record)) {
      this.deactivateCandidate(record);
      return;
    }

    const anchorRect = this.resolveAnchorRect(record);

    if (!anchorRect || anchorRect.width <= 0) {
      this.deactivateCandidate(record);
      return;
    }

    const aspectRatio = this.resolveAspectRatio(record);
    const expandedWidth = anchorRect.width * (this.settings.widthPercent / 100);
    const maximumWidth = Math.max(anchorRect.width, window.innerWidth - VIEWPORT_GUTTER * 2);
    const targetWidth = Math.min(expandedWidth, maximumWidth);
    const targetHeight = targetWidth / aspectRatio;
    const preferredLeft = anchorRect.left + anchorRect.width / 2 - targetWidth / 2;
    const maxLeft = Math.max(VIEWPORT_GUTTER, window.innerWidth - targetWidth - VIEWPORT_GUTTER);
    const targetLeft = clamp(preferredLeft, VIEWPORT_GUTTER, maxLeft);

    activePlacement.frame.style.left = `${Math.round(targetLeft)}px`;
    activePlacement.frame.style.top = `${Math.round(anchorRect.top)}px`;
    activePlacement.frame.style.width = `${Math.round(targetWidth)}px`;
    activePlacement.frame.style.height = `${Math.round(targetHeight)}px`;
    updatePlaceholderHeight(activePlacement, targetHeight);
  }

  private syncFallbackVisibility(): void {
    for (const record of this.candidates.values()) {
      record.isVisible = isElementVisible(record.article);
    }
  }

  private syncPositions(): void {
    for (const record of this.candidates.values()) {
      this.syncCandidatePosition(record);
    }
  }

  private syncToggleButton(record: CandidateRecord): void {
    if (this.settings.autoEnable) {
      this.removeToggleButton(record);
      return;
    }

    if (!record.toggleButton) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "wideplayer-toggle-button";
      button.addEventListener("click", record.handleToggleClick);
      record.toggleButton = button;
    }

    if (record.toggleButton.parentElement !== record.playerElement) {
      record.playerElement.appendChild(record.toggleButton);
    }

    this.updateToggleButtonState(record);
  }

  private toggleCandidate(record: CandidateRecord): void {
    if (this.settings.autoEnable) {
      return;
    }

    if (record.activePlacement) {
      this.deactivateCandidate(record);
      return;
    }

    this.activateCandidate(record);
  }

  private updateCandidate(record: CandidateRecord, elements: CandidateElements): void {
    const anchorChanged = record.anchorElement !== elements.anchorElement;
    const playerChanged = record.playerElement !== elements.playerElement;

    if (record.activePlacement && (anchorChanged || playerChanged)) {
      this.destroyCandidate(record);
      this.createCandidate(elements);
      return;
    }

    if (playerChanged) {
      this.removeToggleButton(record);
      record.playerElement.classList.remove("wideplayer-player-root");
      delete record.playerElement.dataset.wideplayerExpanded;
    }

    record.video = elements.video;
    record.anchorElement = elements.anchorElement;
    record.playerElement = elements.playerElement;
    record.playerElement.classList.add("wideplayer-player-root");
    record.article.dataset.wideplayerMode = this.settings.autoEnable ? "auto" : "manual";

    if (!this.intersectionObserver) {
      record.isVisible = isElementVisible(record.article);
    }

    this.syncToggleButton(record);
  }

  private updateToggleButtonState(record: CandidateRecord): void {
    if (!record.toggleButton) {
      return;
    }

    const isExpanded = Boolean(record.activePlacement);
    record.toggleButton.textContent = isExpanded ? "Collapse" : "Expand";
    record.toggleButton.setAttribute("aria-label", isExpanded ? "Collapse video" : "Expand video");
    record.toggleButton.setAttribute("aria-pressed", String(isExpanded));
    record.toggleButton.dataset.wideplayerState = isExpanded ? "expanded" : "collapsed";
  }

  dispose(): void {
    this.mutationObserver?.disconnect();
    this.intersectionObserver?.disconnect();
    this.unsubscribe?.();
    this.collapseAll();

    for (const record of this.candidates.values()) {
      this.removeToggleButton(record);
      record.playerElement.classList.remove("wideplayer-player-root");
      delete record.playerElement.dataset.wideplayerExpanded;
      record.article.removeAttribute("data-wideplayer-candidate");
      record.article.removeAttribute("data-wideplayer-candidate-id");
      record.article.removeAttribute("data-wideplayer-mode");
      record.article.removeAttribute("data-wideplayer-state");
    }

    this.candidates.clear();
    this.overlayRootManager?.destroy();
    window.removeEventListener("scroll", this.handleScrollOrResize);
    window.removeEventListener("resize", this.handleScrollOrResize);
    window.removeEventListener("pagehide", this.handlePageHide);

    const styleElement = document.getElementById(STYLE_ELEMENT_ID);
    styleElement?.remove();
  }
}

const app = new WidePlayerContentApp();
void app.init();
