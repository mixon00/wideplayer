export interface CandidateElements {
  article: HTMLElement;
  anchorElement: HTMLElement;
  playerElement: HTMLElement;
  video: HTMLVideoElement;
}

export interface OverlayFrameElements {
  frame: HTMLDivElement;
  surface: HTMLDivElement;
}

export interface RectSnapshot {
  height: number;
  left: number;
  top: number;
  width: number;
}

export interface BorderRadiusCorners {
  bottomLeft: string;
  bottomRight: string;
  topLeft: string;
  topRight: string;
}

export interface ActivePlacement {
  anchorElement: HTMLElement;
  frame: HTMLDivElement;
  lastKnownAnchorRect: RectSnapshot;
  mountedElement: HTMLElement;
  overlayRadius: BorderRadiusCorners | null;
  originalNextSibling: ChildNode | null;
  originalParent: HTMLElement;
  placeholder: HTMLDivElement;
  surface: HTMLDivElement;
}

export interface CandidateRecord extends CandidateElements {
  activePlacement: ActivePlacement | null;
  animationFrameId: number | null;
  animationTimeoutId: number | null;
  animationToken: number;
  controlsHideTimeoutId: number | null;
  handleToggleClick: (event: MouseEvent) => void;
  handlePlayerFocusIn: (event: FocusEvent) => void;
  handlePlayerFocusOut: () => void;
  handlePlayerPointerEnter: (event: PointerEvent) => void;
  handlePlayerPointerLeave: () => void;
  handlePlayerPointerMove: (event: PointerEvent) => void;
  handleVideoPause: () => void;
  handleVideoPlay: () => void;
  id: string;
  isVisible: boolean;
  lastKnownAspectRatio: number | null;
  manualTransitionState: "idle" | "expanding" | "collapsing";
  toggleButton: HTMLButtonElement | null;
}
