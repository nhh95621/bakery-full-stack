import { describe, expect, it } from "vitest";
import { filterAndSortProducts } from "../../../frontend/src/lib/catalogue";

const products = [
  { id: 1, price: "150000", reviewCount: 7, rating: "4.7" },
  { id: 2, price: "200000", reviewCount: 12, rating: "4.6" },
  { id: 3, price: "500000", reviewCount: 12, rating: "4.9" },
  { id: 4, price: "650000", reviewCount: 2, rating: "5" },
];

describe("filterAndSortProducts", () => {
  it("applies the documented price-band boundaries", () => {
    expect(filterAndSortProducts(products, "under-200", "default").map((product) => product.id)).toEqual([1]);
    expect(filterAndSortProducts(products, "200-500", "default").map((product) => product.id)).toEqual([2, 3]);
    expect(filterAndSortProducts(products, "over-500", "default").map((product) => product.id)).toEqual([4]);
  });

  it("sorts price in either direction without mutating the source array", () => {
    expect(filterAndSortProducts(products, "all", "price-asc").map((product) => product.id)).toEqual([1, 2, 3, 4]);
    expect(filterAndSortProducts(products, "all", "price-desc").map((product) => product.id)).toEqual([4, 3, 2, 1]);
    expect(products.map((product) => product.id)).toEqual([1, 2, 3, 4]);
  });

  it("uses review count then rating for the popularity ordering", () => {
    expect(filterAndSortProducts(products, "all", "popular").map((product) => product.id)).toEqual([3, 2, 1, 4]);
  });
});
