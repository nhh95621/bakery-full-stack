import { describe, expect, it } from "vitest";
import { validatePromoCode } from "../../../frontend/src/lib/promo";

describe("promo codes", () => {
  it("applies SWEET10 case-insensitively", () => {
    expect(validatePromoCode(" sweet10 ", 300000)).toEqual({
      success: true,
      code: "SWEET10",
      message: "Đã áp dụng Giảm 10%.",
      discountAmount: 30000,
    });
  });

  it("requires the minimum subtotal for BOULANGERIE15", () => {
    const result = validatePromoCode("BOULANGERIE15", 400000);
    expect(result.success).toBe(false);
    expect(result.discountAmount).toBe(0);
    expect(result.message).toContain("500.000₫");
  });

  it("rejects unknown promo codes", () => {
    expect(validatePromoCode("NOT-A-CODE", 100000)).toMatchObject({
      success: false,
      discountAmount: 0,
    });
  });
});
