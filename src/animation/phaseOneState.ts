export type AvatarPose = {
  /** Translation in viewport fractions, independent of the visual renderer. */
  x: number;
  y: number;
  z: number;
  scale: number;
  rotateX: number;
  rotateY: number;
  rotateZ: number;
};

export type PhaseOneState = {
  progress: number;
  darkness: number;
  idleWeight: number;
  avatar: AvatarPose;
};

export const PHASE_ONE = {
  duration: 10,
  signatureStart: 0.37,
  signatureEnd: 0.78,
  complete: 0.94,
  desktopScrollVh: 320,
  mobileScrollVh: 270,
} as const;

export function createPhaseOneState(): PhaseOneState {
  return {
    progress: 0,
    darkness: 0,
    idleWeight: 1,
    avatar: { x: 0, y: 0, z: 0, scale: 1, rotateX: 0, rotateY: 0, rotateZ: 0 },
  };
}

/** Stable handoff contract. Phase 2 may consume this pose; no later behavior lives here. */
export function getPhaseOneEndPose(mobile: boolean, layout: { width: number; height: number; avatarWidth: number; anchorY: number }): AvatarPose {
  const finalWidth = Math.min(layout.width * (mobile ? .88 : .48), layout.height * .67);
  const imageTop = mobile ? .27 : .26;
  return {
    x: 0,
    y: imageTop + finalWidth * .722 / layout.height - layout.anchorY,
    z: 0,
    scale: finalWidth / layout.avatarWidth,
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0,
  };
}
