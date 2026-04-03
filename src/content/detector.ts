import type { CandidateElements } from "./types";

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

function findPlayerElement(video: HTMLVideoElement): HTMLElement | null {
  return video.closest<HTMLElement>(PLAYER_SELECTORS.join(",")) ?? video.parentElement;
}

export function detectFeedVideoCandidates(root: ParentNode = document): CandidateElements[] {
  const candidates: CandidateElements[] = [];

  for (const article of getRootArticles(root)) {
    const videos = getDirectArticleVideos(article);

    if (videos.length !== 1) {
      continue;
    }

    const video = videos[0];
    const playerElement = findPlayerElement(video);

    if (!playerElement) {
      continue;
    }

    if (playerElement.closest("article") !== article) {
      continue;
    }

    candidates.push({
      article,
      playerElement,
      video,
    });
  }

  return candidates;
}
