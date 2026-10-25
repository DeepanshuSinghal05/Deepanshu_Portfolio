/** Screen-pixel offsets; the existing ticker owns time and scroll owns the weight. */
export type HeroAmbient = { photoY: number; haloY: number; time: number };
export function sampleHeroAmbient(time: number, weight: number, mobile: boolean): HeroAmbient {
  return {
    photoY: -Math.sin(time * Math.PI * 2 / 6) * (mobile ? 3 : 6) * weight,
    // Only rise relative to the head, then return. Never dip below the original cage.
    haloY: -(1 - Math.cos(time * Math.PI * 2 / 5.2)) * (mobile ? 3 : 5) * weight,
    time,
  };
}
