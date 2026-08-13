import { useState } from "react";
import { useLocation, useRoute } from "wouter";
import { Check, Circle, MapPin, Package, ReceiptText, Truck, X } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import Header from "@/components/Header";
import CartDrawer from "@/components/CartDrawer";
import { ApiError, ApiLoading } from "@/components/ApiFeedback";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { getOrderTimeline, ORDER_STATUS_COPY } from "@/lib/orderTimeline";
import { trpc } from "@/services/trpc";

const currency = new Intl.NumberFormat("vi-VN");

export default function OrderDetail() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/account/orders/:id");
  const orderId = Number(params?.id);
  const { user, loading: authLoading } = useAuth({ redirectOnUnauthenticated: true });
  const { items, itemCount, removeItem, updateQuantity } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const validOrderId = Number.isInteger(orderId) && orderId > 0;
  const { data: order, isLoading, isError, error, refetch } = trpc.orders.get.useQuery(
    { id: orderId },
    { enabled: !authLoading && Boolean(user) && validOrderId }
  );

  if (authLoading || (!validOrderId && !isError)) {
    return <div className="min-h-screen bg-background"><ApiLoading label="Đang mở đơn hàng của bạn" /></div>;
  }

  if (!user) return null;

  const timeline = order ? getOrderTimeline(order.status) : [];
  const isCancelled = order?.status === "cancelled";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header cartCount={itemCount} onCartClick={() => setCartOpen(true)} onSearchChange={() => {}} favoriteCount={0} />
      <main className="container py-8 md:py-12">
        <button onClick={() => setLocation("/account")} className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-primary">← Trở về hồ sơ</button>
        {isLoading ? (
          <div className="mt-8"><ApiLoading label="Đang tải hành trình giao nhận" /></div>
        ) : isError || !order ? (
          <div className="mt-8"><ApiError title="Không thể mở đơn hàng" description={error?.message || "Đơn hàng không tồn tại hoặc bạn không có quyền xem."} onRetry={() => void refetch()} /></div>
        ) : (
          <>
            <section className="mt-7 border border-primary/10 bg-primary px-6 py-8 text-primary-foreground shadow-[0_20px_55px_rgba(61,39,28,0.12)] md:px-10">
              <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
                <div><p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold">Theo dõi đơn hàng</p><h1 className="mt-3 font-serif text-4xl tracking-[-0.05em]">Commande #{order.id}</h1><p className="mt-3 text-sm text-primary-foreground/65">Đặt ngày {new Date(order.createdAt).toLocaleDateString("vi-VN", { day: "2-digit", month: "long", year: "numeric" })}</p></div>
                <span className={`w-fit px-3 py-1.5 text-xs font-semibold ${isCancelled ? "bg-rose-100 text-rose-800" : "bg-gold text-primary"}`}>{ORDER_STATUS_COPY[order.status] ?? "Đang cập nhật"}</span>
              </div>
            </section>

            <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.45fr)_minmax(280px,.8fr)]">
              <section className="border border-primary/10 bg-card p-6 shadow-sm md:p-8">
                <div className="flex items-center gap-3"><Truck className="text-terracotta" size={20} /><div><p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-terracotta">Lộ trình giao nhận</p><h2 className="mt-1 font-serif text-3xl text-primary">Hành trình của chiếc bánh</h2></div></div>
                <ol className="mt-9 space-y-0" aria-label="Timeline giao nhận">
                  {timeline.map((step, index) => {
                    const current = step.state === "current";
                    const done = step.state === "complete";
                    const cancelled = step.state === "cancelled";
                    return <li key={step.id} className="relative grid grid-cols-[32px_minmax(0,1fr)] gap-4 pb-8 last:pb-0">
                      {index < timeline.length - 1 && <span className={`absolute left-[15px] top-8 h-[calc(100%-18px)] w-px ${done ? "bg-terracotta" : "bg-primary/15"}`} />}
                      <span className={`relative z-10 grid size-8 place-items-center rounded-full border ${done ? "border-terracotta bg-terracotta text-white" : current ? "border-gold bg-gold text-primary ring-4 ring-gold/20" : cancelled ? "border-rose-200 bg-rose-50 text-rose-700" : "border-primary/20 bg-card text-primary/30"}`}>{done ? <Check size={15} /> : cancelled ? <X size={14} /> : <Circle size={10} fill="currentColor" />}</span>
                      <div className="pb-1"><h3 className={`text-sm font-semibold ${current ? "text-primary" : "text-foreground/75"}`}>{step.label}</h3><p className="mt-1 text-sm leading-6 text-muted-foreground">{cancelled ? "Đơn hàng đã được huỷ trước khi bước này bắt đầu." : step.description}</p>{current && <span className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-terracotta"><span className="size-1.5 rounded-full bg-terracotta" /> Trạng thái hiện tại</span>}</div>
                    </li>;
                  })}
                </ol>
              </section>

              <aside className="space-y-5">
                <section className="border border-primary/10 bg-card p-6 shadow-sm"><div className="flex items-center gap-2 text-primary"><MapPin size={18} className="text-terracotta" /><h2 className="font-serif text-2xl">Điểm giao</h2></div><p className="mt-4 text-sm leading-6 text-muted-foreground">{order.customerName}<br />{order.customerPhone}<br />{order.customerAddress}</p>{order.customerNotes && <p className="mt-4 border-t border-primary/10 pt-4 text-xs leading-5 text-muted-foreground"><span className="font-semibold text-foreground">Ghi chú:</span> {order.customerNotes}</p>}</section>
                <section className="border border-primary/10 bg-card p-6 shadow-sm"><div className="flex items-center gap-2 text-primary"><ReceiptText size={18} className="text-terracotta" /><h2 className="font-serif text-2xl">Tóm tắt</h2></div><div className="mt-4 space-y-3">{order.items.map((item) => <div key={item.id} className="flex justify-between gap-3 text-sm"><span className="min-w-0 text-muted-foreground"><strong className="font-semibold text-foreground">{item.quantity}×</strong> {item.productName}<small className="block">{item.size}</small></span><span className="shrink-0 text-primary">{currency.format(Number(item.subtotal))}₫</span></div>)}</div><div className="mt-5 flex justify-between border-t border-primary/10 pt-4 font-semibold text-primary"><span>Tổng thanh toán</span><span>{currency.format(Number(order.total))}₫</span></div></section>
              </aside>
            </div>
          </>
        )}
      </main>
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} items={items} onUpdateQuantity={updateQuantity} onRemoveItem={removeItem} onCheckout={() => { setCartOpen(false); setLocation("/checkout"); }} />
    </div>
  );
}
