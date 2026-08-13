import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/services/trpc";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, Loader2 } from "lucide-react";

interface CartItem {
  productId: number;
  name: string;
  price: number;
  image: string;
  size: string;
  quantity: number;
}

interface CheckoutPageProps {
  items: CartItem[];
  onBack: () => void;
}

const FREE_SHIPPING_THRESHOLD = 500000;

export default function CheckoutPage({ items, onBack }: CheckoutPageProps) {
  const [, setLocation] = useLocation();
  const { user, loading: authLoading } = useAuth({ redirectOnUnauthenticated: true });

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);

  const createOrderMutation = trpc.orders.create.useMutation();

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFree = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shippingCost = shippingFree ? 0 : 30000;
  const total = subtotal + shippingCost;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName || !formData.phone || !formData.address) {
      alert("Vui lòng điền đầy đủ thông tin");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createOrderMutation.mutateAsync({
        customerName: formData.fullName,
        customerPhone: formData.phone,
        customerAddress: formData.address,
        customerNotes: formData.notes,
        items: items.map((item) => ({
          productId: item.productId,
          productName: item.name,
          productPrice: item.price.toString(),
          quantity: item.quantity,
          size: item.size,
          subtotal: (item.price * item.quantity).toString(),
        })),
        subtotal: subtotal.toString(),
        shippingFee: shippingCost.toString(),
        total: total.toString(),
      });

      setOrderId(result.orderId);
      setOrderConfirmed(true);
    } catch (error) {
      console.error("Failed to create order:", error);
      alert("Đặt hàng thất bại. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Giỏ hàng trống</p>
          <Button onClick={onBack} className="btn-primary">
            Quay Lại
          </Button>
        </div>
      </div>
    );
  }

  if (orderConfirmed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="mb-6 flex justify-center">
            <CheckCircle size={64} className="text-green-700" />
          </div>
          <h1 className="serif-title text-3xl mb-2">Đặt Hàng Thành Công!</h1>
          <p className="text-muted-foreground mb-6">
            Cảm ơn bạn đã mua sắm tại Boulangerie
          </p>

          <div className="bg-muted/30 rounded-lg p-6 mb-6 text-left">
            <p className="text-sm mb-3">
              <span className="text-muted-foreground">Mã đơn hàng:</span>
              <br />
              <span className="font-semibold text-base">#{orderId}</span>
            </p>
            <p className="text-sm mb-3">
              <span className="text-muted-foreground">Tên khách hàng:</span>
              <br />
              <span className="font-semibold">{formData.fullName}</span>
            </p>
            <p className="text-sm mb-3">
              <span className="text-muted-foreground">Địa chỉ giao hàng:</span>
              <br />
              <span className="font-semibold">{formData.address}</span>
            </p>
            <p className="text-sm">
              <span className="text-muted-foreground">Tổng tiền:</span>
              <br />
              <span className="font-semibold text-lg">
                {total.toLocaleString("vi-VN")}₫
              </span>
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Chúng tôi sẽ liên hệ với bạn để xác nhận đơn hàng trong vòng 24 giờ.
            </p>
            <Button
              onClick={() => setLocation("/")}
              className="w-full btn-primary py-3"
            >
              Quay Về Trang Chủ
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border">
        <div className="container py-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft size={20} />
            Quay Lại
          </button>
          <h1 className="serif-title text-3xl">Thanh Toán</h1>
        </div>
      </div>

      <div className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Shipping Info */}
              <div>
                <h2 className="serif-subtitle text-xl mb-4">Thông Tin Giao Hàng</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Họ và Tên *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-accent"
                      placeholder="Nhập họ và tên"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Số Điện Thoại *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-accent"
                      placeholder="Nhập số điện thoại"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Địa Chỉ Giao Hàng *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-accent"
                      placeholder="Nhập địa chỉ giao hàng"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Ghi Chú (Tùy Chọn)
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                      placeholder="Ghi chú thêm (ví dụ: giao vào giờ cụ thể)"
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h2 className="serif-subtitle text-xl mb-4">Sản Phẩm</h2>
                <div className="space-y-3">
                  {items.map((item) => (
                    <div
                      key={`${item.productId}-${item.size}`}
                      className="flex items-center gap-3 pb-3 border-b border-border last:border-0"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover bg-muted rounded"
                      />
                      <div className="flex-1">
                        <p className="font-serif text-sm">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.size} × {item.quantity}
                        </p>
                      </div>
                      <p className="font-semibold">
                        {(item.price * item.quantity).toLocaleString("vi-VN")}₫
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary py-3 text-base font-medium"
              >
                {isSubmitting ? "Đang Xử Lý..." : "Xác Nhận Đặt Hàng"}
              </Button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 bg-muted/30 rounded-lg p-6">
              <h3 className="font-serif text-lg mb-4">Tóm Tắt Đơn Hàng</h3>

              <div className="space-y-3 pb-4 border-b border-border">
                {items.map((item) => (
                  <div key={`${item.productId}-${item.size}`} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.name} ({item.size}) × {item.quantity}
                    </span>
                    <span>
                      {(item.price * item.quantity).toLocaleString("vi-VN")}₫
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 py-4 border-b border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tạm tính:</span>
                  <span>{subtotal.toLocaleString("vi-VN")}₫</span>
                </div>
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
              </div>

              <div className="flex justify-between text-base font-semibold pt-4">
                <span>Tổng cộng:</span>
                <span>{total.toLocaleString("vi-VN")}₫</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
