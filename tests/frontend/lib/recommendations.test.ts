import { describe, expect, it } from "vitest";
import { recommendProducts } from "../../../frontend/src/lib/recommendations";

const products = [
  { id: 1, name: "Tart chanh", category: "Tart", imageUrl: "/a.jpg", price: "180000", reviewCount: 4 },
  { id: 2, name: "Tart dâu", category: "Tart", imageUrl: "/b.jpg", price: "220000", reviewCount: 1 },
  { id: 3, name: "Macaron", category: "Macaron", imageUrl: "/c.jpg", price: "150000", tag: "Best Seller", reviewCount: 9 },
  { id: 4, name: "Entremet", category: "Entremet", imageUrl: "/d.jpg", price: "360000", reviewCount: 8 },
];

describe("recommendProducts", () => {
  it("ưu tiên sản phẩm cùng danh mục và không đề xuất lại món đã có", () => {
    expect(recommendProducts(products, [{ productId: 1 }], 3).map((product) => product.id)).toEqual([2, 3, 4]);
  });

  it("không hiển thị gợi ý khi giỏ hàng rỗng", () => {
    expect(recommendProducts(products, [])).toEqual([]);
  });
});
