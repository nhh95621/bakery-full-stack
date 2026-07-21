import { X, Trash2, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFree = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shippingCost = shippingFree ? 0 : 30000;
  const total = subtotal + shippingCost;
  const progressPercent = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="flex-1 bg-foreground/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="w-full max-w-[420px] bg-background flex flex-col shadow-2xl animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <h2 className="serif-subtitle text-lg">Giỏ Hàng</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <p className="text-muted-foreground mb-4">Giỏ hàng trống</p>
              <Button
                onClick={onClose}
                className="btn-outline px-6 py-2 text-sm"
              >
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
                  {/* Image */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover bg-muted rounded"
                  />

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <p className="font-serif text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.size}</p>
                    </div>
                    <p className="text-sm font-semibold">
                      {item.price.toLocaleString("vi-VN")}₫
                    </p>
                  </div>

                  {/* Quantity & Remove */}
                  <div className="flex flex-col items-end justify-between">
                    {/* Quantity */}
                    <div className="flex items-center border border-border rounded">
                      <button
                        onClick={() =>
                          onUpdateQuantity(
                            item.productId,
                            item.size,
                            Math.max(1, item.quantity - 1)
                          )
                        }
                        className="w-6 h-6 flex items-center justify-center hover:bg-muted"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-6 text-center text-xs font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          onUpdateQuantity(item.productId, item.size, item.quantity + 1)
                        }
                        className="w-6 h-6 flex items-center justify-center hover:bg-muted"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => onRemoveItem(item.productId, item.size)}
                      className="text-muted-foreground hover:text-destructive transition-colors mt-2"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Free Shipping Progress */}
        {items.length > 0 && (
          <div className="px-6 py-4 border-t border-border bg-muted/30">
            <div className="mb-2">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">Miễn phí vận chuyển</span>
                <span className="font-medium">
                  {(FREE_SHIPPING_THRESHOLD - subtotal).toLocaleString("vi-VN")}₫
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

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border p-6 space-y-3">
            {/* Subtotal */}
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tạm tính:</span>
              <span>{subtotal.toLocaleString("vi-VN")}₫</span>
            </div>

            {/* Shipping */}
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Vận chuyển:</span>
              <span>
                {shippingFree ? (
                  <span className="text-green-700 font-medium">Miễn phí</span>
                ) : (
                  shippingCost.toLocaleString("vi-VN") + "₫"
                )}
              </span>
            </div>

            {/* Total */}
            <div className="flex justify-between text-base font-semibold pt-3 border-t border-border">
              <span>Tổng cộng:</span>
              <span>{total.toLocaleString("vi-VN")}₫</span>
            </div>

            {/* Checkout Button */}
            <Button
              onClick={onCheckout}
              className="w-full btn-primary py-3 text-base font-medium"
            >
              Thanh Toán
            </Button>

            {/* Continue Shopping */}
            <Button
              onClick={onClose}
              className="w-full btn-outline py-3 text-base font-medium"
            >
              Tiếp Tục Mua Sắm
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
