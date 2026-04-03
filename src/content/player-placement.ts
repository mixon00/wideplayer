import type { ActivePlacement, OverlayFrameElements } from "./types";

function getMeasuredHeight(playerElement: HTMLElement): number {
  const rect = playerElement.getBoundingClientRect();
  return Math.max(1, Math.round(rect.height));
}

export function activatePlayerPlacement(
  playerElement: HTMLElement,
  candidateId: string,
  overlayFrame: OverlayFrameElements
): ActivePlacement | null {
  const originalParent = playerElement.parentElement;

  if (!originalParent) {
    return null;
  }

  const originalNextSibling = playerElement.nextSibling;
  const placeholder = document.createElement("div");
  placeholder.className = "wideplayer-placeholder";
  placeholder.dataset.wideplayerCandidateId = candidateId;
  placeholder.style.height = `${getMeasuredHeight(playerElement)}px`;

  originalParent.insertBefore(placeholder, playerElement);
  overlayFrame.surface.appendChild(playerElement);
  playerElement.classList.add("wideplayer-player-mounted");

  return {
    frame: overlayFrame.frame,
    originalNextSibling,
    originalParent,
    placeholder,
    surface: overlayFrame.surface,
  };
}

export function restorePlayerPlacement(
  playerElement: HTMLElement,
  activePlacement: ActivePlacement
): void {
  const { originalNextSibling, originalParent, placeholder } = activePlacement;
  const placeholderParent = placeholder.parentElement;

  if (placeholderParent) {
    placeholderParent.insertBefore(playerElement, placeholder);
  } else if (originalNextSibling?.parentNode === originalParent) {
    originalParent.insertBefore(playerElement, originalNextSibling);
  } else {
    originalParent.appendChild(playerElement);
  }

  placeholder.remove();
  playerElement.classList.remove("wideplayer-player-mounted");
}

export function updatePlaceholderHeight(activePlacement: ActivePlacement, height: number): void {
  activePlacement.placeholder.style.height = `${Math.max(1, Math.round(height))}px`;
}
