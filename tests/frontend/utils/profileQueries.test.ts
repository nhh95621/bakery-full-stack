import { describe, expect, it, vi } from "vitest";
import { retryProtectedProfileTab, shouldLoadProtectedProfileData } from "../../../frontend/src/utils/profileQueries";

describe("protected profile queries", () => {
  it("waits for authentication before loading private profile data", () => {
    expect(shouldLoadProtectedProfileData(true, false)).toBe(false);
    expect(shouldLoadProtectedProfileData(false, false)).toBe(false);
    expect(shouldLoadProtectedProfileData(false, true)).toBe(true);
  });

  it("retries only the query corresponding to the visible error tab", () => {
    const refetchers = { orders: vi.fn(), reviews: vi.fn(), favorites: vi.fn() };

    retryProtectedProfileTab("reviews", refetchers);

    expect(refetchers.orders).not.toHaveBeenCalled();
    expect(refetchers.reviews).toHaveBeenCalledTimes(1);
    expect(refetchers.favorites).not.toHaveBeenCalled();
  });
});
