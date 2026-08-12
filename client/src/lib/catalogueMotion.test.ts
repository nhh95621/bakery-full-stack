import { describe, expect, it } from "vitest";
import { CATALOGUE_MOTION } from "./catalogueMotion";

describe("catalogue motion preferences", () => {
  it("delegates motion reduction to the user preference", () => {
    expect(CATALOGUE_MOTION.reducedMotion).toBe("user");
  });

  it("keeps catalogue result transitions concise and staggered", () => {
    expect(CATALOGUE_MOTION.duration).toBeLessThanOrEqual(0.3);
    expect(CATALOGUE_MOTION.staggerDelay).toBeGreaterThan(0);
  });
});
