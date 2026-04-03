import type {
  ActivePlacement,
  BorderRadiusCorners,
  OverlayFrameElements,
  RectSnapshot,
} from "./types";

function getMeasuredHeight(playerElement: HTMLElement): number {
  const rect = playerElement.getBoundingClientRect();
  return Math.max(1, Math.round(rect.height));
}

function snapshotRect(element: HTMLElement): RectSnapshot {
  const rect = element.getBoundingClientRect();

  return {
    height: rect.height,
    left: rect.left,
    top: rect.top,
    width: rect.width,
  };
}

function resolveMountedElement(
  playerElement: HTMLElement,
  anchorElement: HTMLElement
): HTMLElement {
  return anchorElement.contains(playerElement) ? anchorElement : playerElement;
}

function readBorderRadiusCorners(element: HTMLElement): BorderRadiusCorners {
  const style = window.getComputedStyle(element);

  return {
    bottomLeft: style.borderBottomLeftRadius,
    bottomRight: style.borderBottomRightRadius,
    topLeft: style.borderTopLeftRadius,
    topRight: style.borderTopRightRadius,
  };
}

function parseRadiusValue(value: string): number | null {
  const match = value.match(/-?\d*\.?\d+/);

  if (!match) {
    return null;
  }

  const parsed = Number.parseFloat(match[0]);
  return Number.isFinite(parsed) ? parsed : null;
}

function hasNonZeroRadius(corners: BorderRadiusCorners): boolean {
  return Object.values(corners).some((value) => (parseRadiusValue(value) ?? 0) > 0);
}

function mergeRadiusCorners(
  target: BorderRadiusCorners | null,
  candidate: BorderRadiusCorners
): BorderRadiusCorners {
  if (!target) {
    return candidate;
  }

  const nextCorners = { ...target };

  for (const corner of Object.keys(nextCorners) as Array<keyof BorderRadiusCorners>) {
    const targetValue = parseRadiusValue(nextCorners[corner]) ?? 0;
    const candidateValue = parseRadiusValue(candidate[corner]) ?? 0;

    if (candidateValue <= 0) {
      continue;
    }

    if (targetValue <= 0 || candidateValue < targetValue) {
      nextCorners[corner] = candidate[corner];
    }
  }

  return nextCorners;
}

function applyOverlayRadius(
  frameElement: HTMLDivElement,
  corners: BorderRadiusCorners | null
): void {
  if (!corners) {
    return;
  }

  frameElement.style.borderTopLeftRadius = corners.topLeft;
  frameElement.style.borderTopRightRadius = corners.topRight;
  frameElement.style.borderBottomRightRadius = corners.bottomRight;
  frameElement.style.borderBottomLeftRadius = corners.bottomLeft;
}

function resolveOverlayRadius(
  mountedElement: HTMLElement,
  playerElement: HTMLElement
): BorderRadiusCorners | null {
  const inspected = new Set<HTMLElement>();
  const queue: HTMLElement[] = [];

  let current: HTMLElement | null = playerElement;

  while (current) {
    queue.push(current);

    if (current === mountedElement) {
      break;
    }

    current = current.parentElement;
  }

  current = playerElement.querySelector<HTMLElement>("video");

  while (current) {
    queue.push(current);

    if (current === mountedElement) {
      break;
    }

    current = current.parentElement;
  }

  queue.unshift(mountedElement);

  let resolvedCorners: BorderRadiusCorners | null = null;

  for (const element of queue) {
    if (inspected.has(element)) {
      continue;
    }

    inspected.add(element);

    const corners = readBorderRadiusCorners(element);

    if (!hasNonZeroRadius(corners)) {
      continue;
    }

    resolvedCorners = mergeRadiusCorners(resolvedCorners, corners);
  }

  return resolvedCorners;
}

export function activatePlayerPlacement(
  playerElement: HTMLElement,
  anchorElement: HTMLElement,
  candidateId: string,
  overlayFrame: OverlayFrameElements
): ActivePlacement | null {
  const mountedElement = resolveMountedElement(playerElement, anchorElement);
  const originalParent = mountedElement.parentElement;

  if (!originalParent) {
    return null;
  }

  const originalNextSibling = mountedElement.nextSibling;
  const lastKnownAnchorRect = snapshotRect(anchorElement);
  const overlayRadius = resolveOverlayRadius(mountedElement, playerElement);
  const placeholder = document.createElement("div");
  placeholder.className = "wideplayer-placeholder";
  placeholder.dataset.wideplayerCandidateId = candidateId;
  placeholder.style.height = `${getMeasuredHeight(anchorElement)}px`;

  applyOverlayRadius(overlayFrame.frame, overlayRadius);

  originalParent.insertBefore(placeholder, mountedElement);
  overlayFrame.surface.appendChild(mountedElement);
  mountedElement.classList.add("wideplayer-player-mounted");

  return {
    anchorElement,
    frame: overlayFrame.frame,
    lastKnownAnchorRect,
    mountedElement,
    overlayRadius,
    originalNextSibling,
    originalParent,
    placeholder,
    surface: overlayFrame.surface,
  };
}

export function restorePlayerPlacement(activePlacement: ActivePlacement): void {
  const { mountedElement, originalNextSibling, originalParent, placeholder } = activePlacement;

  if (originalNextSibling?.parentNode === originalParent) {
    originalParent.insertBefore(mountedElement, originalNextSibling);
  } else {
    originalParent.appendChild(mountedElement);
  }

  placeholder.remove();
  mountedElement.classList.remove("wideplayer-player-mounted");
}

export function updatePlaceholderHeight(activePlacement: ActivePlacement, height: number): void {
  activePlacement.placeholder.style.height = `${Math.max(1, Math.round(height))}px`;
}
