export const PRICE_RANGES = [
  { value: "all", label: "Mọi khoảng giá" },
  { value: "under-200", label: "Dưới 200.000₫" },
  { value: "200-500", label: "Từ 200.000–500.000₫" },
  { value: "over-500", label: "Trên 500.000₫" },
] as const;

export const SORT_OPTIONS = [
  { value: "default", label: "Thứ tự tuyển chọn" },
  { value: "price-asc", label: "Giá thấp đến cao" },
  { value: "price-desc", label: "Giá cao đến thấp" },
  { value: "popular", label: "Được yêu thích nhất" },
] as const;

export type PriceRange = (typeof PRICE_RANGES)[number]["value"];
export type SortOption = (typeof SORT_OPTIONS)[number]["value"];

export interface CatalogueProduct {
  price: number | string;
  category?: string | null;
  reviewCount?: number | null;
  rating?: number | string | null;
}

export function filterAndSortProducts<T extends CatalogueProduct>(
  products: readonly T[],
  priceRange: PriceRange,
  sortOption: SortOption,
  category?: string
): T[] {
  const filtered = products.filter((product) => {
    const price = Number(product.price);
    const categoryMatches = !category || product.category?.toLocaleLowerCase() === category.toLocaleLowerCase();
    if (!categoryMatches) return false;
    if (priceRange === "under-200") return price < 200000;
    if (priceRange === "200-500") return price >= 200000 && price <= 500000;
    if (priceRange === "over-500") return price > 500000;
    return true;
  });

  return [...filtered].sort((left, right) => {
    if (sortOption === "price-asc") return Number(left.price) - Number(right.price);
    if (sortOption === "price-desc") return Number(right.price) - Number(left.price);
    if (sortOption === "popular") {
      const reviewDifference = Number(right.reviewCount || 0) - Number(left.reviewCount || 0);
      return reviewDifference || Number(right.rating || 0) - Number(left.rating || 0);
    }
    return 0;
  });
}
