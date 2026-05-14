import { DEFAULT_SETTINGS, STYLE_ELEMENT_ID, X_HOSTS, type Settings } from "../shared/constants";
import {
  loadLiveWidthPreview,
  loadSettings,
  subscribeToLiveWidthPreview,
  subscribeToSettings,
  type LiveWidthPreview,
} from "../shared/settings";
import { detectFeedVideoCandidates } from "./detector";
import { OverlayRootManager } from "./overlay-root";
import {
  activatePlayerPlacement,
  restorePlayerPlacement,
  updatePlaceholderHeight,
} from "./player-placement";
import { contentStyles } from "./styles";
import type { ActivePlacement, CandidateElements, CandidateRecord, RectSnapshot } from "./types";

const MAX_VIEWPORT_HEIGHT_RATIO = 0.9;
const LIVE_WIDTH_PREVIEW_TTL_MS = 400;
const MANUAL_TOGGLE_TRANSITION_MS = 180;
const MANUAL_CONTROLS_IDLE_TIMEOUT_MS = 2000;
const MANUAL_CENTERING_SCROLL_TOLERANCE_PX = 2;
const VIEWPORT_GUTTER = 16;
const EXPAND_ICON_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M10 12h-7l3 -3" />
  <path d="M6 15l-3 -3" />
  <path d="M14 12h7l-3 -3" />
  <path d="M18 15l3 -3" />
  <path d="M3 6v-1a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v1" />
  <path d="M3 18v1a2 2 0 0 0 2 2h14a2 2 0 0 0 2 -2v-1" />
</svg>`.trim();
const COLLAPSE_ICON_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M3 12h7l-3 -3" />
  <path d="M7 15l3 -3" />
  <path d="M21 12h-7l3 -3" />
  <path d="M17 15l-3 -3" />
  <path d="M9 6v-1a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v1" />
  <path d="M9 18v1a2 2 0 0 0 2 2h2a2 2 0 0 0 2 -2v-1" />
</svg>`.trim();

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function lerp(start: number, end: number, progress: number): number {
  return start + (end - start) * progress;
}

function smoothstep(value: number): number {
  const clampedValue = clamp(value, 0, 1);
  return clampedValue * clampedValue * (3 - 2 * clampedValue);
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

  return visibleHeight > 0;
}

function isVideoPaused(record: CandidateRecord): boolean {
  return Boolean(record.video?.paused);
}

function isMastodonPage(): boolean {
  const applicationName = document.querySelector<HTMLMetaElement>("meta[name='application-name']");

  if (applicationName?.content.toLowerCase() === "mastodon") {
    return true;
  }

  const generator = document.querySelector<HTMLMetaElement>("meta[name='generator']");

  if (generator?.content.toLowerCase().includes("mastodon")) {
    return true;
  }

  return Boolean(document.querySelector("body#mastodon, #mastodon"));
}

function getSupportedPlatform(): "mastodon" | "x" | null {
  // The manifest matches HTTPS pages so federated Mastodon instances can work.
  if (X_HOSTS.has(window.location.hostname)) {
    return "x";
  }

  if (isMastodonPage()) {
    return "mastodon";
  }

  return null;
}

interface CandidateGeometry {
  expansionProgress: number;
  height: number;
  left: number;
  top: number;
  width: number;
}

class WidePlayerContentApp {
  private readonly candidates = new Map<HTMLElement, CandidateRecord>();
  private readonly handleDocumentClick = (event: MouseEvent): void => {
    if (this.isAutoModeEnabled() || !this.hasActiveCandidates()) {
      return;
    }

    const target = event.target;

    if (!(target instanceof Node)) {
      return;
    }

    if (this.isWithinAnyToggleButton(target) || this.isWithinAnyActiveOverlay(target)) {
      return;
    }

    this.collapseAll({ animate: true });
  };
  private readonly handlePageHide = (): void => {
    this.dispose();
  };
  private readonly handleScrollOrResize = (): void => {
    if (!this.intersectionObserver && this.isAutoModeEnabled()) {
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

      record.isVisible = entry.isIntersecting;
    }

    if (this.isAutoModeEnabled()) {
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
  private platform: "mastodon" | "x" | null = null;
  private liveWidthPreview: LiveWidthPreview | null = null;
  private liveWidthPreviewTimeoutId: number | null = null;
  private scanQueued = false;
  private settings: Settings = DEFAULT_SETTINGS;
  private syncQueued = false;
  private unsubscribeLiveWidthPreview: (() => void) | null = null;
  private unsubscribe: (() => void) | null = null;

  private isAutoModeEnabled(settings: Settings = this.settings): boolean {
    return this.platform === "mastodon" ? settings.autoEnableMastodon : settings.autoEnableX;
  }

  async init(): Promise<void> {
    this.platform = getSupportedPlatform();

    if (!this.platform) {
      return;
    }

    if (!document.body || !document.head) {
      return;
    }

    this.injectStyles();
    document.documentElement.dataset.wideplayerPlatform = this.platform;
    this.overlayRootManager = new OverlayRootManager();
    this.settings = await loadSettings();
    this.liveWidthPreview = await loadLiveWidthPreview();
    this.applySettings();
    this.createIntersectionObserver();
    this.observeMutations();
    this.scanForCandidates();
    this.unsubscribe = subscribeToSettings(async (nextSettings) => {
      this.handleSettingsChange(nextSettings);
    });
    this.unsubscribeLiveWidthPreview = subscribeToLiveWidthPreview((nextPreview) => {
      this.handleLiveWidthPreviewChange(nextPreview);
    });

    window.addEventListener("scroll", this.handleScrollOrResize, { passive: true });
    window.addEventListener("resize", this.handleScrollOrResize);
    window.addEventListener("pagehide", this.handlePageHide, { once: true });
    document.addEventListener("click", this.handleDocumentClick, true);
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

    if (this.isAutoModeEnabled()) {
      this.syncCandidatePosition(record);
      this.schedulePositionSync();
      return;
    }

    this.animateCandidateExpansion(record);
    this.scrollCandidateToViewportCenter(record);
  }

  private applySettings(): void {
    document.documentElement.dataset.wideplayerMode = this.isAutoModeEnabled() ? "auto" : "manual";
    document.documentElement.style.setProperty(
      "--wideplayer-width-percent",
      String(this.getEffectiveWidthPercent())
    );
  }

  private animateCandidateExpansion(record: CandidateRecord): void {
    const activePlacement = record.activePlacement;

    if (!activePlacement) {
      return;
    }

    this.cancelCandidateAnimation(record);

    const collapsedGeometry = this.resolveCandidateGeometry(record, 0);

    if (!collapsedGeometry) {
      this.syncCandidatePosition(record);
      this.schedulePositionSync();
      return;
    }

    const animationToken = ++record.animationToken;
    record.manualTransitionState = "expanding";

    activePlacement.frame.dataset.wideplayerTransition = "manual";
    activePlacement.placeholder.dataset.wideplayerTransition = "manual";
    this.applyCandidateGeometry(activePlacement, collapsedGeometry);

    record.animationFrameId = window.requestAnimationFrame(() => {
      record.animationFrameId = null;

      if (animationToken !== record.animationToken || record.activePlacement !== activePlacement) {
        return;
      }

      this.syncCandidatePosition(record);
      this.schedulePositionSync();
      record.animationTimeoutId = window.setTimeout(() => {
        record.animationTimeoutId = null;

        if (animationToken !== record.animationToken || record.activePlacement !== activePlacement) {
          return;
        }

        record.manualTransitionState = "idle";
        this.clearCandidateAnimationStyles(activePlacement);
      }, MANUAL_TOGGLE_TRANSITION_MS);
    });
  }

  private applyCandidateGeometry(
    activePlacement: ActivePlacement,
    geometry: CandidateGeometry
  ): void {
    activePlacement.frame.style.setProperty(
      "--wideplayer-scroll-progress",
      geometry.expansionProgress.toFixed(4)
    );
    activePlacement.placeholder.style.setProperty(
      "--wideplayer-scroll-progress",
      geometry.expansionProgress.toFixed(4)
    );
    activePlacement.frame.style.left = `${Math.round(geometry.left)}px`;
    activePlacement.frame.style.top = `${Math.round(geometry.top)}px`;
    activePlacement.frame.style.width = `${Math.round(geometry.width)}px`;
    activePlacement.frame.style.height = `${Math.round(geometry.height)}px`;
    updatePlaceholderHeight(activePlacement, geometry.height);
  }

  private cancelCandidateAnimation(record: CandidateRecord): void {
    record.animationToken += 1;
    record.manualTransitionState = "idle";

    if (record.animationFrameId !== null) {
      window.cancelAnimationFrame(record.animationFrameId);
      record.animationFrameId = null;
    }

    if (record.animationTimeoutId !== null) {
      window.clearTimeout(record.animationTimeoutId);
      record.animationTimeoutId = null;
    }

    this.clearCandidateAnimationStyles(record.activePlacement);
  }

  private clearCandidateAnimationStyles(activePlacement: CandidateRecord["activePlacement"]): void {
    activePlacement?.frame.removeAttribute("data-wideplayer-transition");
    activePlacement?.placeholder.removeAttribute("data-wideplayer-transition");
  }

  private clearControlsHideTimeout(record: CandidateRecord): void {
    if (record.controlsHideTimeoutId !== null) {
      window.clearTimeout(record.controlsHideTimeoutId);
      record.controlsHideTimeoutId = null;
    }
  }

  private setControlsVisibility(record: CandidateRecord, isVisible: boolean): void {
    record.playerElement.dataset.wideplayerControlsVisible = String(isVisible);
  }

  private isToggleButtonFocusVisible(record: CandidateRecord): boolean {
    return Boolean(record.toggleButton?.matches(":focus-visible"));
  }

  private scheduleControlsHide(record: CandidateRecord): void {
    if (
      this.isAutoModeEnabled() ||
      this.isToggleButtonFocusVisible(record) ||
      isVideoPaused(record)
    ) {
      this.clearControlsHideTimeout(record);
      return;
    }

    this.clearControlsHideTimeout(record);
    record.controlsHideTimeoutId = window.setTimeout(() => {
      record.controlsHideTimeoutId = null;

      if (!this.isToggleButtonFocusVisible(record) && !isVideoPaused(record)) {
        this.setControlsVisibility(record, false);
      }
    }, MANUAL_CONTROLS_IDLE_TIMEOUT_MS);
  }

  private handlePlayerPointerActivity(record: CandidateRecord, event: PointerEvent): void {
    if (this.isAutoModeEnabled() || (event.pointerType && event.pointerType === "touch")) {
      return;
    }

    this.setControlsVisibility(record, true);
    this.scheduleControlsHide(record);
  }

  private attachControlVisibilityListeners(record: CandidateRecord): void {
    record.playerElement.dataset.wideplayerControlsVisible = "false";
    record.playerElement.addEventListener("focusin", record.handlePlayerFocusIn);
    record.playerElement.addEventListener("focusout", record.handlePlayerFocusOut);
    record.playerElement.addEventListener("pointerenter", record.handlePlayerPointerEnter);
    record.playerElement.addEventListener("pointerleave", record.handlePlayerPointerLeave);
    record.playerElement.addEventListener("pointermove", record.handlePlayerPointerMove);
    record.video?.addEventListener("pause", record.handleVideoPause);
    record.video?.addEventListener("play", record.handleVideoPlay);
  }

  private detachControlVisibilityListeners(record: CandidateRecord): void {
    this.clearControlsHideTimeout(record);
    record.playerElement.removeEventListener("focusin", record.handlePlayerFocusIn);
    record.playerElement.removeEventListener("focusout", record.handlePlayerFocusOut);
    record.playerElement.removeEventListener("pointerenter", record.handlePlayerPointerEnter);
    record.playerElement.removeEventListener("pointerleave", record.handlePlayerPointerLeave);
    record.playerElement.removeEventListener("pointermove", record.handlePlayerPointerMove);
    record.video?.removeEventListener("pause", record.handleVideoPause);
    record.video?.removeEventListener("play", record.handleVideoPlay);
    record.playerElement.removeAttribute("data-wideplayer-controls-visible");
  }

  private scrollCandidateToViewportCenter(record: CandidateRecord): void {
    const expandedGeometry = this.resolveCandidateGeometry(record, 1);

    if (!expandedGeometry) {
      return;
    }

    const currentScrollTop = window.scrollY;
    const centeredTop = (window.innerHeight - expandedGeometry.height) / 2;
    const scrollingElement = document.scrollingElement ?? document.documentElement;
    const maximumScrollTop = Math.max(0, scrollingElement.scrollHeight - window.innerHeight);
    const targetScrollTop = clamp(
      currentScrollTop + expandedGeometry.top - centeredTop,
      0,
      maximumScrollTop
    );

    if (Math.abs(targetScrollTop - currentScrollTop) <= MANUAL_CENTERING_SCROLL_TOLERANCE_PX) {
      return;
    }

    const behavior: ScrollBehavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "auto"
      : "smooth";

    window.scrollTo({
      behavior,
      top: Math.round(targetScrollTop),
    });
  }

  private collapseAll(options: { animate?: boolean } = {}): void {
    for (const record of this.candidates.values()) {
      this.deactivateCandidate(record, options);
    }
  }

  private createCandidate(elements: CandidateElements): CandidateRecord {
    const record: CandidateRecord = {
      ...elements,
      activePlacement: null,
      controlsHideTimeoutId: null,
      handleToggleClick: (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.toggleCandidate(record);
      },
      handlePlayerFocusIn: (event) => {
        if (!record.toggleButton || event.target !== record.toggleButton) {
          return;
        }

        if (!this.isToggleButtonFocusVisible(record)) {
          return;
        }

        this.clearControlsHideTimeout(record);
        this.setControlsVisibility(record, true);
      },
      handlePlayerFocusOut: () => {
        window.requestAnimationFrame(() => {
          if (this.isToggleButtonFocusVisible(record)) {
            return;
          }

          if (isVideoPaused(record)) {
            this.setControlsVisibility(record, true);
            return;
          }

          if (record.playerElement.matches(":hover")) {
            this.scheduleControlsHide(record);
            return;
          }

          this.setControlsVisibility(record, false);
        });
      },
      handlePlayerPointerEnter: (event) => {
        this.handlePlayerPointerActivity(record, event);
      },
      handlePlayerPointerLeave: () => {
        this.clearControlsHideTimeout(record);

        if (!this.isToggleButtonFocusVisible(record) && !isVideoPaused(record)) {
          this.setControlsVisibility(record, false);
        }
      },
      handlePlayerPointerMove: (event) => {
        this.handlePlayerPointerActivity(record, event);
      },
      handleVideoPause: () => {
        this.clearControlsHideTimeout(record);

        if (!this.isAutoModeEnabled()) {
          this.setControlsVisibility(record, true);
        }
      },
      handleVideoPlay: () => {
        this.clearControlsHideTimeout(record);

        if (this.isAutoModeEnabled() || this.isToggleButtonFocusVisible(record)) {
          return;
        }

        this.setControlsVisibility(record, false);
      },
      animationFrameId: null,
      animationTimeoutId: null,
      animationToken: 0,
      id: `wideplayer-${++this.candidateSequence}`,
      isVisible: this.intersectionObserver ? false : isElementVisible(elements.article),
      lastKnownAspectRatio: null,
      manualTransitionState: "idle",
      toggleButton: null,
    };

    record.article.dataset.wideplayerCandidate = "true";
    record.article.dataset.wideplayerCandidateId = record.id;
    record.article.dataset.wideplayerMode = this.isAutoModeEnabled() ? "auto" : "manual";
    record.article.dataset.wideplayerState = "collapsed";
    record.playerElement.classList.add("wideplayer-player-root");
    record.playerElement.dataset.wideplayerMediaKind = record.mediaKind;
    this.attachControlVisibilityListeners(record);
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
      threshold: [0, 0.5, 1],
    });
  }

  private deactivateCandidate(record: CandidateRecord, options: { animate?: boolean } = {}): void {
    const activePlacement = record.activePlacement;

    if (!activePlacement) {
      this.updateToggleButtonState(record);
      return;
    }

    this.cancelCandidateAnimation(record);

    if (options.animate) {
      const currentGeometry = this.resolveCandidateGeometry(record);
      const collapsedGeometry = this.resolveCandidateGeometry(record, 0);

      if (currentGeometry && collapsedGeometry) {
        const animationToken = ++record.animationToken;
        record.manualTransitionState = "collapsing";

        activePlacement.frame.dataset.wideplayerTransition = "manual";
        activePlacement.placeholder.dataset.wideplayerTransition = "manual";
        this.applyCandidateGeometry(activePlacement, currentGeometry);

        record.animationFrameId = window.requestAnimationFrame(() => {
          record.animationFrameId = null;

          if (animationToken !== record.animationToken || record.activePlacement !== activePlacement) {
            return;
          }

          this.applyCandidateGeometry(activePlacement, collapsedGeometry);
          record.animationTimeoutId = window.setTimeout(() => {
            record.animationTimeoutId = null;

            if (animationToken !== record.animationToken || record.activePlacement !== activePlacement) {
              return;
            }

            this.finalizeCandidateDeactivation(record, activePlacement);
          }, MANUAL_TOGGLE_TRANSITION_MS);
        });
        return;
      }
    }

    this.finalizeCandidateDeactivation(record, activePlacement);
  }

  private finalizeCandidateDeactivation(
    record: CandidateRecord,
    activePlacement: NonNullable<CandidateRecord["activePlacement"]>
  ): void {
    record.manualTransitionState = "idle";
    this.clearCandidateAnimationStyles(activePlacement);

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
    this.detachControlVisibilityListeners(record);
    this.intersectionObserver?.unobserve(record.article);
    record.playerElement.classList.remove("wideplayer-player-root");
    record.playerElement.removeAttribute("data-wideplayer-media-kind");
    delete record.playerElement.dataset.wideplayerExpanded;
    record.article.removeAttribute("data-wideplayer-candidate");
    record.article.removeAttribute("data-wideplayer-candidate-id");
    record.article.removeAttribute("data-wideplayer-mode");
    record.article.removeAttribute("data-wideplayer-state");
    this.candidates.delete(record.article);
  }

  private handleSettingsChange(nextSettings: Settings): void {
    const modeChanged = this.isAutoModeEnabled() !== this.isAutoModeEnabled(nextSettings);

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

  private handleLiveWidthPreviewChange(nextPreview: LiveWidthPreview | null): void {
    this.liveWidthPreview = nextPreview;
    this.scheduleLiveWidthPreviewExpiry();
    this.applySettings();

    if (this.hasActiveCandidates()) {
      this.schedulePositionSync();
    }
  }

  private clearLiveWidthPreview(): void {
    this.liveWidthPreview = null;

    if (this.liveWidthPreviewTimeoutId !== null) {
      window.clearTimeout(this.liveWidthPreviewTimeoutId);
      this.liveWidthPreviewTimeoutId = null;
    }
  }

  private getEffectiveWidthPercent(): number {
    if (!this.liveWidthPreview) {
      return this.settings.widthPercent;
    }

    if (Date.now() - this.liveWidthPreview.updatedAt > LIVE_WIDTH_PREVIEW_TTL_MS) {
      this.clearLiveWidthPreview();
      return this.settings.widthPercent;
    }

    return this.liveWidthPreview.widthPercent;
  }

  private scheduleLiveWidthPreviewExpiry(): void {
    if (this.liveWidthPreviewTimeoutId !== null) {
      window.clearTimeout(this.liveWidthPreviewTimeoutId);
      this.liveWidthPreviewTimeoutId = null;
    }

    if (!this.liveWidthPreview) {
      return;
    }

    const timeRemaining = Math.max(
      0,
      LIVE_WIDTH_PREVIEW_TTL_MS - (Date.now() - this.liveWidthPreview.updatedAt)
    );

    this.liveWidthPreviewTimeoutId = window.setTimeout(() => {
      this.liveWidthPreviewTimeoutId = null;

      if (!this.liveWidthPreview) {
        return;
      }

      if (Date.now() - this.liveWidthPreview.updatedAt < LIVE_WIDTH_PREVIEW_TTL_MS) {
        this.scheduleLiveWidthPreviewExpiry();
        return;
      }

      this.clearLiveWidthPreview();
      this.applySettings();

      if (this.hasActiveCandidates()) {
        this.schedulePositionSync();
      }
    }, timeRemaining + 1);
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

  private isWithinAnyActiveOverlay(target: Node): boolean {
    for (const record of this.candidates.values()) {
      if (record.activePlacement?.frame.contains(target)) {
        return true;
      }
    }

    return false;
  }

  private isWithinAnyToggleButton(target: Node): boolean {
    for (const record of this.candidates.values()) {
      if (record.toggleButton?.contains(target)) {
        return true;
      }
    }

    return false;
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
    this.clearControlsHideTimeout(record);
    this.setControlsVisibility(record, false);

    if (!record.toggleButton) {
      return;
    }

    this.cancelCandidateAnimation(record);
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
    if (record.video && record.video.videoWidth > 0 && record.video.videoHeight > 0) {
      const videoAspectRatio = record.video.videoWidth / record.video.videoHeight;
      record.lastKnownAspectRatio = videoAspectRatio;
      return videoAspectRatio;
    }

    if (record.mediaElement instanceof HTMLIFrameElement) {
      const width = Number.parseFloat(record.mediaElement.getAttribute("width") ?? "");
      const height = Number.parseFloat(record.mediaElement.getAttribute("height") ?? "");

      if (width > 0 && height > 0) {
        const iframeAspectRatio = width / height;
        record.lastKnownAspectRatio = iframeAspectRatio;
        return iframeAspectRatio;
      }
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

    if (!this.intersectionObserver && this.isAutoModeEnabled()) {
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
      record.article.dataset.wideplayerMode = this.isAutoModeEnabled() ? "auto" : "manual";
      this.syncToggleButton(record);

      if (!this.isAutoModeEnabled()) {
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

  private resolveViewportExpansionProgress(
    anchorTop: number,
    collapsedHeight: number,
    expandedHeight: number
  ): number {
    const entryTop = window.innerHeight;
    const centeredTop = (window.innerHeight - expandedHeight) / 2;
    const exitTop = -collapsedHeight;

    if (anchorTop >= centeredTop) {
      const distanceFromEntryToCenter = Math.max(1, entryTop - centeredTop);
      return clamp(1 - (anchorTop - centeredTop) / distanceFromEntryToCenter, 0, 1);
    }

    const distanceFromCenterToExit = Math.max(1, centeredTop - exitTop);
    return clamp(1 - (centeredTop - anchorTop) / distanceFromCenterToExit, 0, 1);
  }

  private resolveCandidateGeometry(
    record: CandidateRecord,
    expansionProgressOverride?: number
  ): CandidateGeometry | null {
    const activePlacement = record.activePlacement;

    if (!activePlacement) {
      return null;
    }

    if (!record.article.isConnected || !activePlacement.placeholder.isConnected) {
      this.destroyCandidate(record);
      return null;
    }

    if (!this.ensureActivePlacementConnection(record)) {
      this.deactivateCandidate(record);
      return null;
    }

    const anchorRect = this.resolveAnchorRect(record);

    if (!anchorRect || anchorRect.width <= 0) {
      return null;
    }

    const aspectRatio = this.resolveAspectRatio(record);
    const collapsedWidth = anchorRect.width;
    const collapsedHeight = collapsedWidth / aspectRatio;
    const maximumWidthByViewport = Math.max(anchorRect.width, window.innerWidth - VIEWPORT_GUTTER * 2);
    const maximumWidthByHeight = Math.max(
      anchorRect.width,
      window.innerHeight * MAX_VIEWPORT_HEIGHT_RATIO * aspectRatio
    );
    const maximumWidth = Math.min(maximumWidthByViewport, maximumWidthByHeight);
    const expandedWidth =
      anchorRect.width +
      (maximumWidth - anchorRect.width) * (this.getEffectiveWidthPercent() / 100);
    const expandedHeight = expandedWidth / aspectRatio;
    const preferredLeft = (window.innerWidth - expandedWidth) / 2;

    const maxLeft = Math.max(
      VIEWPORT_GUTTER,
      window.innerWidth - expandedWidth - VIEWPORT_GUTTER
    );
    const expandedLeft = clamp(preferredLeft, VIEWPORT_GUTTER, maxLeft);
    const expansionProgress =
      expansionProgressOverride === undefined
        ? smoothstep(this.resolveViewportExpansionProgress(anchorRect.top, collapsedHeight, expandedHeight))
        : clamp(expansionProgressOverride, 0, 1);
    const currentWidth = lerp(collapsedWidth, expandedWidth, expansionProgress);
    const currentHeight = currentWidth / aspectRatio;
    const currentLeft = lerp(anchorRect.left, expandedLeft, expansionProgress);

    return {
      expansionProgress,
      height: currentHeight,
      left: currentLeft,
      top: anchorRect.top,
      width: currentWidth,
    };
  }

  private syncCandidatePosition(record: CandidateRecord): void {
    const activePlacement = record.activePlacement;

    if (!activePlacement) {
      return;
    }

    if (record.manualTransitionState === "collapsing") {
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

    const geometry = this.resolveCandidateGeometry(record);

    if (!geometry) {
      this.deactivateCandidate(record);
      return;
    }

    this.applyCandidateGeometry(activePlacement, geometry);
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
    if (this.isAutoModeEnabled()) {
      this.clearControlsHideTimeout(record);
      this.setControlsVisibility(record, false);
      this.removeToggleButton(record);
      return;
    }

    const didCreateButton = !record.toggleButton;

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

    if (this.isToggleButtonFocusVisible(record)) {
      this.clearControlsHideTimeout(record);
      this.setControlsVisibility(record, true);
    } else if (didCreateButton && record.playerElement.matches(":hover")) {
      this.setControlsVisibility(record, true);
      this.scheduleControlsHide(record);
    }

    this.updateToggleButtonState(record);
  }

  private toggleCandidate(record: CandidateRecord): void {
    if (this.isAutoModeEnabled()) {
      return;
    }

    if (record.activePlacement) {
      this.deactivateCandidate(record, { animate: true });
      return;
    }

    this.activateCandidate(record);
  }

  private updateCandidate(record: CandidateRecord, elements: CandidateElements): void {
    const anchorChanged = record.anchorElement !== elements.anchorElement;
    const mediaChanged = record.mediaElement !== elements.mediaElement;
    const playerChanged = record.playerElement !== elements.playerElement;
    const videoChanged = record.video !== elements.video || mediaChanged;

    if (record.activePlacement && (anchorChanged || playerChanged)) {
      this.destroyCandidate(record);
      this.createCandidate(elements);
      return;
    }

    if (playerChanged) {
      this.removeToggleButton(record);
      this.detachControlVisibilityListeners(record);
      record.playerElement.classList.remove("wideplayer-player-root");
      record.playerElement.removeAttribute("data-wideplayer-media-kind");
      delete record.playerElement.dataset.wideplayerExpanded;
    } else if (videoChanged) {
      record.video?.removeEventListener("pause", record.handleVideoPause);
      record.video?.removeEventListener("play", record.handleVideoPlay);
    }

    record.mediaElement = elements.mediaElement;
    record.mediaKind = elements.mediaKind;
    record.video = elements.video;
    record.anchorElement = elements.anchorElement;
    record.playerElement = elements.playerElement;
    record.playerElement.classList.add("wideplayer-player-root");
    record.playerElement.dataset.wideplayerMediaKind = record.mediaKind;
    if (playerChanged) {
      this.attachControlVisibilityListeners(record);
    } else if (videoChanged) {
      record.video?.addEventListener("pause", record.handleVideoPause);
      record.video?.addEventListener("play", record.handleVideoPlay);
    }
    record.article.dataset.wideplayerMode = this.isAutoModeEnabled() ? "auto" : "manual";

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
    record.toggleButton.innerHTML = isExpanded ? COLLAPSE_ICON_SVG : EXPAND_ICON_SVG;
    record.toggleButton.setAttribute("aria-label", isExpanded ? "Collapse video" : "Expand video");
    record.toggleButton.setAttribute("aria-pressed", String(isExpanded));
    record.toggleButton.dataset.wideplayerState = isExpanded ? "expanded" : "collapsed";
  }

  dispose(): void {
    this.mutationObserver?.disconnect();
    this.intersectionObserver?.disconnect();
    this.unsubscribe?.();
    this.unsubscribeLiveWidthPreview?.();
    this.collapseAll();

    if (this.liveWidthPreviewTimeoutId !== null) {
      window.clearTimeout(this.liveWidthPreviewTimeoutId);
      this.liveWidthPreviewTimeoutId = null;
    }

    for (const record of this.candidates.values()) {
      this.cancelCandidateAnimation(record);
      this.removeToggleButton(record);
      this.detachControlVisibilityListeners(record);
      record.playerElement.classList.remove("wideplayer-player-root");
      record.playerElement.removeAttribute("data-wideplayer-media-kind");
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
    document.removeEventListener("click", this.handleDocumentClick, true);

    const styleElement = document.getElementById(STYLE_ELEMENT_ID);
    styleElement?.remove();
    document.documentElement.removeAttribute("data-wideplayer-platform");
  }
}

const app = new WidePlayerContentApp();
void app.init();
