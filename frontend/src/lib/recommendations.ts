export type CatalogueProduct = {
  id: number;
  name: string;
  category: string;
  imageUrl: string;
  price: string | number;
  sizes?: string | null;
  tag?: string | null;
  reviewCount?: number | null;
};

type CartProduct = { productId: number };

export function recommendProducts(
  products: CatalogueProduct[],
  cartItems: CartProduct[],
  limit = 3
): CatalogueProduct[] {
  if (cartItems.length === 0) return [];

  const inCart = new Set(cartItems.map((item) => item.productId));
  const productById = new Map(products.map((product) => [product.id, product]));
  const cartCategories = new Set(
    cartItems
      .map((item) => productById.get(item.productId)?.category)
      .filter((category): category is string => Boolean(category))
  );

  return products
    .filter((product) => !inCart.has(product.id))
    .map((product) => {
      const categoryAffinity = cartCategories.has(product.category) ? 100 : 0;
      const bestsellerAffinity = product.tag?.toLowerCase().includes("best") ? 15 : 0;
      const socialProofAffinity = Math.min(Number(product.reviewCount || 0), 10);
      return { product, score: categoryAffinity + bestsellerAffinity + socialProofAffinity };
    })
    .sort((left, right) => right.score - left.score || left.product.id - right.product.id)
    .slice(0, limit)
    .map(({ product }) => product);
}
