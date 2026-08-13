import { describe, expect, it } from "vitest";
import { getCataloguePage } from "../../../frontend/src/lib/cataloguePagination";

describe("getCataloguePage", () => {
  it("keeps the first page bounded and reports remaining products", () => {
    const page = getCataloguePage(Array.from({ length: 8 }, (_, index) => index + 1), 6);

    expect(page.displayedProducts).toEqual([1, 2, 3, 4, 5, 6]);
    expect(page.displayedCount).toBe(6);
    expect(page.hasMore).toBe(true);
    expect(page.nextCount).toBe(8);
  });

  it("reports a completed catalogue after loading the remaining products", () => {
    const page = getCataloguePage(Array.from({ length: 8 }, (_, index) => index + 1), 12);

    expect(page.displayedCount).toBe(8);
    expect(page.hasMore).toBe(false);
    expect(page.nextCount).toBe(8);
  });
});
