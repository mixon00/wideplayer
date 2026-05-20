import type { CandidateElements, CandidateMediaElement } from "../types";

const FEED_ITEM_SELECTOR = ".status";
const MEDIA_ROOT_SELECTORS = [
  ".media-gallery",
  ".media-gallery__item",
  ".status-card",
  ".status-card__image",
  ".video-player",
];
const PLAYER_SELECTORS = [
  ".status-card",
  ".status-card__image",
  ".video-player",
];
const YOUTUBE_IFRAME_SELECTOR = [
  "iframe[src*='youtube.com/embed/']",
  "iframe[src*='youtube-nocookie.com/embed/']",
].join(",");
const YOUTUBE_LINK_SELECTOR = [
  "a[href*='youtube.com/']",
  "a[href*='youtube-nocookie.com/']",
  "a[href*='youtu.be/']",
].join(",");

function getClosestFeedItem(element: Element): HTMLElement | null {
  return element.closest<HTMLElement>(FEED_ITEM_SELECTOR);
}

function getRootFeedItems(root: ParentNode): HTMLElement[] {
  if (root instanceof HTMLElement && root.matches(FEED_ITEM_SELECTOR)) {
    return [root];
  }

  return Array.from(root.querySelectorAll<HTMLElement>(FEED_ITEM_SELECTOR)).filter(
    (feedItem) => getClosestFeedItem(feedItem) === feedItem
  );
}

function getDirectMediaElements(feedItem: HTMLElement): CandidateMediaElement[] {
  const playableMediaElements = Array.from(
    feedItem.querySelectorAll<CandidateMediaElement>(`video, ${YOUTUBE_IFRAME_SELECTOR}`)
  ).filter((mediaElement) => getClosestFeedItem(mediaElement) === feedItem);

  if (playableMediaElements.length > 0) {
    return playableMediaElements;
  }

  return Array.from(feedItem.querySelectorAll<HTMLElement>(".status-card")).filter((cardElement) => {
    if (getClosestFeedItem(cardElement) !== feedItem) {
      return false;
    }

    return Boolean(
      cardElement.querySelector(".status-card__image") &&
        cardElement.querySelector(YOUTUBE_LINK_SELECTOR)
    );
  });
}

function findClosestInFeedItem(
  element: HTMLElement,
  feedItem: HTMLElement,
  selectors: string[]
): HTMLElement | null {
  for (const selector of selectors) {
    const candidate = element.closest<HTMLElement>(selector);

    if (candidate && getClosestFeedItem(candidate) === feedItem) {
      return candidate;
    }
  }

  return null;
}

function findPlayerElement(mediaElement: CandidateMediaElement): HTMLElement | null {
  if (
    !(mediaElement instanceof HTMLVideoElement) &&
    !(mediaElement instanceof HTMLIFrameElement)
  ) {
    return mediaElement.querySelector<HTMLElement>(".status-card__image") ?? mediaElement;
  }

  let current: HTMLElement | null = mediaElement.parentElement;
  let outermostMatch: HTMLElement | null = null;

  while (current) {
    if (current.matches(FEED_ITEM_SELECTOR)) {
      break;
    }

    if (current.matches(PLAYER_SELECTORS.join(","))) {
      outermostMatch = current;
    }

    current = current.parentElement;
  }

  return outermostMatch ?? mediaElement.parentElement;
}

function findAnchorElement(
  mediaElement: CandidateMediaElement,
  feedItem: HTMLElement
): HTMLElement | null {
  if (mediaElement instanceof HTMLVideoElement) {
    return (
      findClosestInFeedItem(mediaElement, feedItem, PLAYER_SELECTORS) ??
      findClosestInFeedItem(mediaElement, feedItem, MEDIA_ROOT_SELECTORS) ??
      findPlayerElement(mediaElement)
    );
  }

  if (!(mediaElement instanceof HTMLIFrameElement)) {
    return findClosestInFeedItem(mediaElement, feedItem, [".status-card__image"]) ?? mediaElement;
  }

  return (
    findClosestInFeedItem(mediaElement, feedItem, MEDIA_ROOT_SELECTORS) ??
    findPlayerElement(mediaElement)
  );
}

export function detectMastodonFeedVideoCandidates(root: ParentNode): CandidateElements[] {
  const candidates: CandidateElements[] = [];

  for (const feedItem of getRootFeedItems(root)) {
    const mediaElements = getDirectMediaElements(feedItem);

    if (mediaElements.length !== 1) {
      continue;
    }

    const mediaElement = mediaElements[0];
    const anchorElement = findAnchorElement(mediaElement, feedItem);
    const playerElement = findPlayerElement(mediaElement);

    if (!anchorElement || !playerElement) {
      continue;
    }

    if (
      getClosestFeedItem(anchorElement) !== feedItem ||
      getClosestFeedItem(playerElement) !== feedItem
    ) {
      continue;
    }

    candidates.push({
      article: feedItem,
      anchorElement,
      mediaElement,
      mediaKind: mediaElement instanceof HTMLVideoElement ? "native-video" : "youtube",
      playerElement,
      video: mediaElement instanceof HTMLVideoElement ? mediaElement : null,
    });
  }

  return candidates;
}
