export type CheckoutLineSource = {
  productId: number;
  quantity: number;
};

export const SHOPIFY_VARIANT_BY_PRODUCT_ID: Record<number, string> = {
  1: "gid://shopify/ProductVariant/46578998378598",
  2: "gid://shopify/ProductVariant/46578953060454",
  3: "gid://shopify/ProductVariant/46579001720934",
  4: "gid://shopify/ProductVariant/46578953093222",
  5: "gid://shopify/ProductVariant/46579004080230",
  6: "gid://shopify/ProductVariant/46579004276838",
  7: "gid://shopify/ProductVariant/46579005522022",
  8: "gid://shopify/ProductVariant/46579005554790",
};

export function buildShopifyCheckoutLines(items: CheckoutLineSource[]) {
  const unsupportedProductIds = items
    .filter((item) => !SHOPIFY_VARIANT_BY_PRODUCT_ID[item.productId])
    .map((item) => item.productId);

  return {
    lines: items
      .filter((item) => SHOPIFY_VARIANT_BY_PRODUCT_ID[item.productId])
      .map((item) => ({
        variantId: SHOPIFY_VARIANT_BY_PRODUCT_ID[item.productId],
        quantity: item.quantity,
      })),
    unsupportedProductIds,
  };
}
