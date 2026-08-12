import { useState } from "react";
import { toast } from "sonner";
import { X, Trash2, Plus, Minus, Tag, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";

interface CartItem {
  productId: number;
  name: string;
  price: number;
  image: string;
  size: string;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: number, size: string, quantity: number) => void;
  onRemoveItem: (productId: number, size: string) => void;
  onCheckout: () => void;
}

const FREE_SHIPPING_THRESHOLD = 500000;

export default function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}: CartDrawerProps) {
  const [promoInput, setPromoInput] = useState("");
  const { promoCode, discountAmount, applyPromoCode, removePromoCode } = useCart();

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFree = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shippingCost = shippingFree ? 0 : 30000;
  const total = Math.max(0, subtotal - discountAmount) + shippingCost;
  const progressPercent = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);

  const handleApplyPromo = () => {
    const result = applyPromoCode(promoInput);
    if (result.success) {
      toast.success(result.message, {
        description: `Bạn đã tiết kiệm ${result.discountAmount.toLocaleString("vi-VN")}₫.`,
      });
      setPromoInput("");
    } else {
      toast.error(result.message);
    }
  };

  const handleRemovePromo = () => {
    removePromoCode();
    toast.success("Đã bỏ mã giảm giá.");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex" role="dialog" aria-modal="true" aria-label="Giỏ hàng">
      <div
        className="flex-1 bg-foreground/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="w-full max-w-[420px] bg-background flex flex-col shadow-2xl animate-slide-in-right">
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div>
            <h2 className="serif-subtitle text-lg">Giỏ Hàng</h2>
            <p className="text-xs text-muted-foreground mt-1">{items.length} sản phẩm</p>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors p-2"
            aria-label="Đóng giỏ hàng"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <p className="text-muted-foreground mb-4">Giỏ hàng trống</p>
              <Button onClick={onClose} className="btn-outline px-6 py-2 text-sm">
                Tiếp Tục Mua Sắm
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.size}`}
                  className="flex gap-3 pb-4 border-b border-border last:border-0"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover bg-muted rounded"
                  />

                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <p className="font-serif text-sm font-medium truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.size}</p>
                    </div>
                    <p className="text-sm font-semibold">
                      {item.price.toLocaleString("vi-VN")}₫
                    </p>
                  </div>

                  <div className="flex flex-col items-end justify-between">
                    <div className="flex items-center border border-border rounded">
                      <button
                        onClick={() =>
                          onUpdateQuantity(item.productId, item.size, Math.max(1, item.quantity - 1))
                        }
                        className="w-6 h-6 flex items-center justify-center hover:bg-muted"
                        aria-label={`Giảm số lượng ${item.name}`}
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-6 text-center text-xs font-medium">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.productId, item.size, item.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center hover:bg-muted"
                        aria-label={`Tăng số lượng ${item.name}`}
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.productId, item.size)}
                      className="text-muted-foreground hover:text-destructive transition-colors mt-2 p-1"
                      aria-label={`Xóa ${item.name} khỏi giỏ hàng`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="px-6 py-4 border-t border-border bg-muted/30">
            <div className="mb-2">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">Miễn phí vận chuyển</span>
                <span className="font-medium">
                  {shippingFree
                    ? "Đã đạt"
                    : `${(FREE_SHIPPING_THRESHOLD - subtotal).toLocaleString("vi-VN")}₫`}
                </span>
              </div>
              <div className="w-full h-2 bg-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
            {shippingFree ? (
              <p className="text-xs text-green-700 font-medium">✓ Bạn đã đủ điều kiện miễn phí vận chuyển!</p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Mua thêm {(FREE_SHIPPING_THRESHOLD - subtotal).toLocaleString("vi-VN")}₫ để được miễn phí vận chuyển
              </p>
            )}
          </div>
        )}

        {items.length > 0 && (
          <div className="border-t border-border p-6 space-y-3">
            <div className="space-y-2">
              <label htmlFor="promo-code" className="flex items-center gap-2 text-sm font-medium">
                <Tag size={15} className="text-accent" />
                Mã giảm giá
              </label>
              {promoCode ? (
                <div className="flex items-center justify-between gap-3 rounded border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800">
                  <span className="flex items-center gap-2 font-medium">
                    <Check size={14} /> {promoCode}
                  </span>
                  <button onClick={handleRemovePromo} className="text-xs underline hover:no-underline">
                    Bỏ mã
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    id="promo-code"
                    value={promoInput}
                    onChange={(event) => setPromoInput(event.target.value.toUpperCase())}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") handleApplyPromo();
                    }}
                    placeholder="Ví dụ: SWEET10"
                    className="min-w-0 flex-1 rounded border border-border bg-background px-3 py-2 text-sm uppercase focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <Button type="button" onClick={handleApplyPromo} className="btn-outline px-4 py-2 text-sm">
                    Áp dụng
                  </Button>
                </div>
              )}
              <p className="text-[11px] text-muted-foreground">Mã thử nghiệm: SWEET10 hoặc BOULANGERIE15.</p>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tạm tính:</span>
              <span>{subtotal.toLocaleString("vi-VN")}₫</span>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between text-sm text-green-700">
                <span>Giảm giá:</span>
                <span>-{discountAmount.toLocaleString("vi-VN")}₫</span>
              </div>
            )}

            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Vận chuyển:</span>
              <span>
                {shippingFree ? (
                  <span className="text-green-700 font-medium">Miễn phí</span>
                ) : (
                  `${shippingCost.toLocaleString("vi-VN")}₫`
                )}
              </span>
            </div>

            <div className="flex justify-between text-base font-semibold pt-3 border-t border-border">
              <span>Tổng cộng:</span>
              <span>{total.toLocaleString("vi-VN")}₫</span>
            </div>

            <Button onClick={onCheckout} className="w-full btn-primary py-3 text-base font-medium">
              Thanh Toán
            </Button>
            <Button onClick={onClose} className="w-full btn-outline py-3 text-base font-medium">
              Tiếp Tục Mua Sắm
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
