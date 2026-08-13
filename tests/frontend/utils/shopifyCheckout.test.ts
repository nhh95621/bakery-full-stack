import { describe, expect, it } from "vitest";
import { buildShopifyCheckoutLines } from "../../../frontend/src/lib/shopifyCheckout";

describe("buildShopifyCheckoutLines", () => {
  it("translates catalogue products into Shopify cart lines", () => {
    expect(buildShopifyCheckoutLines([{ productId: 1, quantity: 2 }, { productId: 8, quantity: 1 }])).toEqual({
      lines: [
        { variantId: "gid://shopify/ProductVariant/46578998378598", quantity: 2 },
        { variantId: "gid://shopify/ProductVariant/46579005554790", quantity: 1 },
      ],
      unsupportedProductIds: [],
    });
  });

  it("detects an unknown product so checkout never sends a partial cart", () => {
    expect(buildShopifyCheckoutLines([{ productId: 2, quantity: 1 }, { productId: 999, quantity: 1 }])).toMatchObject({
      lines: [{ variantId: "gid://shopify/ProductVariant/46578953060454", quantity: 1 }],
      unsupportedProductIds: [999],
    });
  });
});
