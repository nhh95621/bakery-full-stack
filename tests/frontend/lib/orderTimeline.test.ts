import { describe, expect, it } from "vitest";
import { getOrderTimeline } from "../../../frontend/src/lib/orderTimeline";

describe("getOrderTimeline", () => {
  it("marks earlier stages complete and the shipped stage current", () => {
    expect(getOrderTimeline("shipped").map((step) => step.state)).toEqual(["complete", "complete", "complete", "current", "upcoming"]);
  });

  it("marks the post-order journey cancelled when an order is cancelled", () => {
    expect(getOrderTimeline("cancelled").map((step) => step.state)).toEqual(["complete", "cancelled", "cancelled", "cancelled", "cancelled"]);
  });
});
