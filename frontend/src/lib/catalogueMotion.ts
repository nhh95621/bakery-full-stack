export const CATALOGUE_MOTION = {
  reducedMotion: "user" as const,
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  duration: 0.22,
  staggerDelay: 0.025,
  ease: [0.23, 1, 0.32, 1] as [number, number, number, number],
};
