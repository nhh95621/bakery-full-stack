export const CATALOGUE_PAGE_SIZE = 6;

export function getCataloguePage<T>(products: T[], visibleCount: number, pageSize = CATALOGUE_PAGE_SIZE) {
  const safeVisibleCount = Math.max(pageSize, visibleCount);
  const displayedProducts = products.slice(0, safeVisibleCount);

  return {
    displayedProducts,
    displayedCount: displayedProducts.length,
    hasMore: displayedProducts.length < products.length,
    nextCount: Math.min(products.length, displayedProducts.length + pageSize),
  };
}
