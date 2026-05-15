import { detectMastodonFeedVideoCandidates } from "./detectors/mastodon";
import { detectXFeedVideoCandidates } from "./detectors/x";
import type { SupportedPlatform } from "./platform";
import type { CandidateElements } from "./types";

export function detectFeedVideoCandidates(
  platform: SupportedPlatform,
  root: ParentNode = document
): CandidateElements[] {
  return platform === "x"
    ? detectXFeedVideoCandidates(root)
    : detectMastodonFeedVideoCandidates(root);
}
