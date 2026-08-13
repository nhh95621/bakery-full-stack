import { describe, expect, it } from "vitest";
import { ABOUT_CTA_PATH, ABOUT_VALUES } from "../../../frontend/src/pages/aboutContent";

describe("about page content", () => {
  it("defines three distinct core brand values with complete copy", () => {
    expect(ABOUT_VALUES).toHaveLength(3);
    expect(new Set(ABOUT_VALUES.map((value) => value.title)).size).toBe(3);
    expect(ABOUT_VALUES.every((value) => value.description.trim().length > 40)).toBe(true);
  });

  it("keeps the main call to action directed to the catalog", () => {
    expect(ABOUT_CTA_PATH).toBe("/#products");
  });
});
