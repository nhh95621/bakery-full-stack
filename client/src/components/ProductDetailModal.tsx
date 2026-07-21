import { useState } from "react";
import { X, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductDetailModalProps {
  product: {
    id: number;
    name: string;
    subtitle: string;
    description: string;
    price: number;
    originalPrice?: number;
    imageUrl: string;
    rating: number;
    reviewCount: number;
    sizes: string[];
  };
  onClose: () => void;
  onAddToCart: (productId: number, size: string, quantity: number) => void;
}

export default function ProductDetailModal({
  product,
  onClose,
  onAddToCart,
}: ProductDetailModalProps) {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || "Default");
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    onAddToCart(product.id, selectedSize, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 hover:bg-muted rounded transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-8">
          {/* Image */}
          <div className="flex items-center justify-center">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-auto object-cover rounded-lg"
            />
          </div>

          {/* Details */}
          <div className="flex flex-col gap-6">
            {/* Title */}
            <div>
              <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-2">
                {product.subtitle}
              </p>
              <h1 className="serif-title text-3xl mb-2">{product.name}</h1>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{product.rating.toFixed(1)} ⭐</span>
                <span className="text-sm text-muted-foreground">
                  ({product.reviewCount} đánh giá)
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground leading-relaxed">
              {product.description}
            </p>

            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-semibold">
                {product.price.toLocaleString("vi-VN")}₫
              </span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  {product.originalPrice.toLocaleString("vi-VN")}₫
                </span>
              )}
            </div>

            {/* Size Selection */}
            <div>
              <label className="block text-sm font-medium mb-3">Chọn Kích Thước</label>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border transition-all ${
                      selectedSize === size
                        ? "border-foreground bg-foreground text-background"
                        : "border-border hover:border-foreground"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selection */}
            <div>
              <label className="block text-sm font-medium mb-3">Số Lượng</label>
              <div className="flex items-center border border-border w-fit">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-muted transition-colors"
                >
                  <Minus size={16} />
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center hover:bg-muted transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <Button
              onClick={handleAddToCart}
              className="w-full btn-primary py-3 text-base font-medium"
            >
              Thêm Vào Giỏ Hàng
            </Button>

            {/* Additional Info */}
            <div className="border-t border-border pt-4 space-y-2 text-sm text-muted-foreground">
              <p>✓ Giao hàng miễn phí cho đơn từ 500.000₫</p>
              <p>✓ Bảo hành chất lượng 100%</p>
              <p>✓ Hỗ trợ khách hàng 24/7</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
