import type { CandidateElements } from "./types";

const MEDIA_ROOT_SELECTOR = "[data-testid='tweetPhoto']";
const PLAYER_SELECTORS = ["[data-testid='videoPlayer']", "[data-testid='videoComponent']"];

function getRootArticles(root: ParentNode): HTMLElement[] {
  if (root instanceof HTMLElement && root.matches("article")) {
    return [root];
  }

  return Array.from(root.querySelectorAll<HTMLElement>("article"));
}

function getDirectArticleVideos(article: HTMLElement): HTMLVideoElement[] {
  return Array.from(article.querySelectorAll<HTMLVideoElement>("video")).filter(
    (video) => video.closest("article") === article
  );
}

function findAnchorElement(video: HTMLVideoElement): HTMLElement | null {
  return video.closest<HTMLElement>(MEDIA_ROOT_SELECTOR) ?? findPlayerElement(video);
}

function findPlayerElement(video: HTMLVideoElement): HTMLElement | null {
  let current: HTMLElement | null = video.parentElement;
  let outermostMatch: HTMLElement | null = null;

  while (current) {
    if (current.matches("article")) {
      break;
    }

    if (current.matches(PLAYER_SELECTORS.join(","))) {
      outermostMatch = current;
    }

    current = current.parentElement;
  }

  return outermostMatch ?? video.parentElement;
}

export function detectFeedVideoCandidates(root: ParentNode = document): CandidateElements[] {
  const candidates: CandidateElements[] = [];

  for (const article of getRootArticles(root)) {
    const videos = getDirectArticleVideos(article);

    if (videos.length !== 1) {
      continue;
    }

    const video = videos[0];
    const anchorElement = findAnchorElement(video);
    const playerElement = findPlayerElement(video);

    if (!anchorElement || !playerElement) {
      continue;
    }

    if (anchorElement.closest("article") !== article || playerElement.closest("article") !== article) {
      continue;
    }

    candidates.push({
      article,
      anchorElement,
      playerElement,
      video,
    });
  }

  return candidates;
}
