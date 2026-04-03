export interface CandidateElements {
  article: HTMLElement;
  playerElement: HTMLElement;
  video: HTMLVideoElement;
}

export interface OverlayFrameElements {
  frame: HTMLDivElement;
  surface: HTMLDivElement;
}

export interface ActivePlacement {
  frame: HTMLDivElement;
  originalNextSibling: ChildNode | null;
  originalParent: HTMLElement;
  placeholder: HTMLDivElement;
  surface: HTMLDivElement;
}

export interface CandidateRecord extends CandidateElements {
  activePlacement: ActivePlacement | null;
  handleToggleClick: (event: MouseEvent) => void;
  id: string;
  isVisible: boolean;
  lastKnownAspectRatio: number | null;
  toggleButton: HTMLButtonElement | null;
}
