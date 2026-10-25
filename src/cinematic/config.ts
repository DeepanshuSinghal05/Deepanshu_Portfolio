export const cinematicConfig = {
  scroll: { desktop: 800, mobile: 650, reduced: 300 },
  avatar: { height: 2.1, entryFeet: -2.6, entryScale: 1.7, mobileEntryFeet: -1.25, mobileEntryScale: .95 },
  tunnel: { radius: 4.4, top: 5, bottom: -48, module: 3.5, bays: [5, -1, -7.5, -12, -15.5, -18.5, -22, -26, -33, -41, -48] },
  atmosphere: { fogNear: 16, fogFar: 96, particles: 110, mobileParticles: 42, velocityDamping: 7, velocityMax: 1.2 },
  zones: { entry: [0, .19], upper: [.19, .3], deep: [.3, .4], acceleration: [.4, .47], lower: [.47, .535], approach: [.535, .56], impact: [.56, .64], breakthrough: [.64, .76], landing: [.76, .91], arrival: [.91, 1] },
  lighting: { upper: 1.8, deep: .85, lower: 1.45, settled: 1.6, lowerSource: 6 },
  impactPoint: [0, -32, 0] as const,
  breakthroughY: -38,
  landingPoint: [0, -45, 0] as const,
  storyOrigin: [0, -45, 0] as const,
  storyDirection: [0, 0, -1] as const,
  glass: { radius: 4.3, sectors: 13, rings: 3 },
  camera: { fov: 42, finalFov: 38, finalPosition: [-1.85, -43.35, 6.5] as const, mobileFinalX: -.57, mobileFinalZ: 7.7, finalTarget: [-1.85, -43.9, 0] as const, scalePullback: 2.2, fallLag: 1.1, speedFov: 3 },
  timing: { spatial: [0, .15], tunnel: [.08, .24], descent: [.19, .56], speed: [.28, .48], glass: [.44, .55], impact: [.56, .595], fracturedHold: [.595, .62], fracture: [.62, .735], breakthrough: [.65, .76], landing: [.76, .87], settle: [.87, .96], final: [.91, 1] },
} as const;
export const clamp = (v: number) => Math.max(0, Math.min(1, v));
export const range = (p: number, a: number, b: number) => clamp((p - a) / (b - a));
export const smooth = (v: number) => v * v * (3 - 2 * v);
export const mix = (a: number, b: number, p: number) => a + (b - a) * p;
export function progressAt(p: number) {
  return Object.fromEntries(Object.entries(cinematicConfig.timing).map(([key, [a, b]]) => [key, range(p, a, b)])) as Record<keyof typeof cinematicConfig.timing, number>;
}
