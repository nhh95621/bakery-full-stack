import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/services/trpc";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, Heart, Loader2, MessageSquareText, Package, ShoppingBag, Sparkles, Star, Truck } from "lucide-react";
import Header from "@/components/Header";
import CartDrawer from "@/components/CartDrawer";
import { ApiError, ApiLoading } from "@/components/ApiFeedback";
import { useCart } from "@/contexts/CartContext";
import { retryProtectedProfileTab, shouldLoadProtectedProfileData } from "@/utils/profileQueries";

type AccountTab = "orders" | "reviews" | "favorites";

const orderStatuses: Record<string, { label: string; className: string }> = {
  pending: { label: "Chờ xác nhận", className: "bg-gold/15 text-primary" },
  confirmed: { label: "Đã xác nhận", className: "bg-terracotta/10 text-terracotta" },
  processing: { label: "Đang hoàn thiện", className: "bg-primary/10 text-primary" },
  shipped: { label: "Đang giao", className: "bg-sky-100 text-sky-800" },
  delivered: { label: "Đã giao", className: "bg-emerald-100 text-emerald-800" },
  cancelled: { label: "Đã huỷ", className: "bg-rose-100 text-rose-800" },
};

const currency = new Intl.NumberFormat("vi-VN");

function EmptyState({ icon: Icon, title, description, actionLabel, onAction }: { icon: typeof Package; title: string; description: string; actionLabel: string; onAction: () => void }) {
  return (
    <div className="border border-dashed border-primary/20 bg-card px-6 py-14 text-center shadow-sm">
      <span className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-gold/15 text-primary"><Icon size={21} /></span>
      <h3 className="serif-subtitle text-xl text-primary">{title}</h3>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted-foreground">{description}</p>
      <Button onClick={onAction} className="btn-primary mt-6">{actionLabel}</Button>
    </div>
  );
}

export default function Account() {
  const [, setLocation] = useLocation();
  const { user, loading: authLoading } = useAuth({ redirectOnUnauthenticated: true });
  const { items, itemCount, addItem, removeItem, updateQuantity } = useCart();
  const [activeTab, setActiveTab] = useState<AccountTab>("orders");
  const [cartOpen, setCartOpen] = useState(false);

  const protectedQueryOptions = { enabled: shouldLoadProtectedProfileData(authLoading, Boolean(user)) };
  const { data: userOrders = [], isLoading: ordersLoading, isError: ordersError, refetch: refetchOrders } = trpc.orders.list.useQuery(undefined, protectedQueryOptions);
  const { data: userFavorites = [], isLoading: favoritesLoading, isError: favoritesError, refetch: refetchFavorites } = trpc.favorites.list.useQuery(undefined, protectedQueryOptions);
  const { data: userReviews = [], isLoading: reviewsLoading, isError: reviewsError, refetch: refetchReviews } = trpc.reviews.listMine.useQuery(undefined, protectedQueryOptions);
  const deliveredOrders = useMemo(() => userOrders.filter((order) => order.status === "delivered").length, [userOrders]);
  const profileInitials = (user?.name || user?.email || "B").trim().slice(0, 2).toUpperCase();
  const startShopping = () => setLocation("/products");
  const activeError = activeTab === "orders" ? ordersError : activeTab === "reviews" ? reviewsError : favoritesError;
  const retryActiveTab = () => retryProtectedProfileTab(activeTab, { orders: refetchOrders, reviews: refetchReviews, favorites: refetchFavorites });

  const addFavoriteToCart = (favorite: (typeof userFavorites)[number]) => {
    const product = favorite.product;
    const firstSize = (() => {
      try {
        const sizes = JSON.parse(product.sizes || "[]");
        return Array.isArray(sizes) && sizes[0] ? String(sizes[0]) : "Tiêu chuẩn";
      } catch {
        return "Tiêu chuẩn";
      }
    })();
    addItem({ productId: product.id, name: product.name, price: Number(product.price), image: product.imageUrl, size: firstSize, quantity: 1 });
    toast.success("Đã thêm vào giỏ hàng", { description: product.name });
    setCartOpen(true);
  };

  if (authLoading) return <div className="flex min-h-screen items-center justify-center bg-background"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  if (!user) {
    return <div className="flex min-h-screen items-center justify-center bg-background px-6"><div className="max-w-sm text-center"><p className="serif-subtitle text-2xl text-primary">Phiên truy cập đã kết thúc</p><p className="mt-2 text-sm text-muted-foreground">Vui lòng đăng nhập để xem hồ sơ Boulangerie của bạn.</p><Button onClick={() => setLocation("/")} className="btn-primary mt-6">Quay về trang chủ</Button></div></div>;
  }

  const tabs = [
    { id: "orders" as const, label: "Đơn hàng", count: userOrders.length, icon: Package },
    { id: "reviews" as const, label: "Đánh giá", count: userReviews.length, icon: MessageSquareText },
    { id: "favorites" as const, label: "Yêu thích", count: userFavorites.length, icon: Heart },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header cartCount={itemCount} onCartClick={() => setCartOpen(true)} onSearchChange={() => {}} favoriteCount={userFavorites.length} />
      <main className="container pb-16 pt-8 md:pt-12">
        <button onClick={() => setLocation("/")} className="mb-7 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-primary"><ArrowLeft size={16} /> Quay lại maison</button>

        <section className="overflow-hidden border border-primary/10 bg-primary text-primary-foreground shadow-[0_20px_55px_rgba(61,39,28,0.12)]">
          <div className="grid gap-7 px-6 py-8 sm:px-9 lg:grid-cols-[1.2fr_auto] lg:items-end lg:px-12 lg:py-11">
            <div className="flex items-center gap-5"><div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-gold/45 bg-primary-foreground/10 font-serif text-xl text-gold">{profileInitials}</div><div><p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-gold">Mon espace Boulangerie</p><h1 className="serif-title mt-2 text-3xl sm:text-4xl">{user.name || "Khách hàng Boulangerie"}</h1><p className="mt-2 text-sm text-primary-foreground/65">{user.email || "Tài khoản thành viên"}</p></div></div>
            <p className="max-w-xs text-sm leading-6 text-primary-foreground/70 lg:text-right">Mọi đơn hàng và đánh giá của bạn được lưu riêng tư trong không gian này.</p>
          </div>
          <div className="grid border-t border-primary-foreground/10 sm:grid-cols-3">
            {[{ label: "Tổng đơn", value: userOrders.length }, { label: "Đã giao", value: deliveredOrders }, { label: "Đánh giá đã gửi", value: userReviews.length }].map((metric, index) => <div key={metric.label} className={`px-6 py-4 sm:px-9 ${index < 2 ? "border-b border-primary-foreground/10 sm:border-b-0 sm:border-r" : ""}`}><p className="text-[10px] uppercase tracking-[0.18em] text-primary-foreground/55">{metric.label}</p><p className="mt-1 font-serif text-2xl text-gold">{metric.value}</p></div>)}
          </div>
        </section>

        <div className="mt-8 grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)]">
          <nav className="flex gap-2 overflow-x-auto border-b border-primary/10 pb-3 lg:flex-col lg:border-b-0 lg:border-r lg:pb-0 lg:pr-5" aria-label="Điều hướng hồ sơ">
            {tabs.map(({ id, label, count, icon: Icon }) => <button key={id} onClick={() => setActiveTab(id)} className={`flex shrink-0 items-center gap-3 px-4 py-3 text-left text-sm font-semibold transition-all duration-200 ${activeTab === id ? "bg-gold text-primary shadow-sm" : "text-muted-foreground hover:bg-card hover:text-primary"}`}><Icon size={17} />{label}<span className="ml-auto text-xs tabular-nums opacity-70">{count}</span></button>)}
          </nav>

          <section aria-live="polite">
            {activeError ? <ApiError title="Không thể tải dữ liệu này" description="Vui lòng kiểm tra kết nối và thử lại để tiếp tục xem không gian Boulangerie của bạn." onRetry={retryActiveTab} /> : <>
            {activeTab === "orders" && <div><div className="mb-6 flex items-end justify-between gap-4"><div><p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-terracotta">Les commandes</p><h2 className="serif-title mt-2 text-3xl text-primary">Lịch sử đơn hàng</h2></div><ShoppingBag size={22} className="text-gold" /></div>
              {ordersLoading ? <ApiLoading label="Đang tải lịch sử đơn hàng" /> : userOrders.length === 0 ? <EmptyState icon={Package} title="Chưa có đơn hàng nào" description="Khám phá những chiếc bánh được hoàn thiện theo mùa cho lần ghé thăm đầu tiên." actionLabel="Khám phá sản phẩm" onAction={startShopping} /> : <div className="space-y-4">{userOrders.map((order) => { const status = orderStatuses[order.status] ?? orderStatuses.pending; const visibleItems = order.items.slice(0, 2); const remainingItems = order.items.length - visibleItems.length; return <article key={order.id} className="border border-primary/10 bg-card p-5 shadow-sm transition-shadow hover:shadow-md sm:p-6"><div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-terracotta">Commande #{order.id}</p><h3 className="serif-subtitle mt-1 text-xl text-primary">{order.items.length} món trong đơn</h3><p className="mt-2 text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleDateString("vi-VN", { day: "2-digit", month: "long", year: "numeric" })}</p></div><span className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}>{status.label}</span></div><div className="mt-5 space-y-2 border-t border-primary/10 pt-4">{visibleItems.map((item) => <div key={item.id} className="flex items-center justify-between gap-4 text-sm"><p className="min-w-0 truncate text-foreground"><span className="font-semibold">{item.quantity}×</span> {item.productName}<span className="ml-2 text-xs text-muted-foreground">{item.size}</span></p><span className="shrink-0 text-muted-foreground">{currency.format(Number(item.subtotal))}₫</span></div>)}{remainingItems > 0 && <p className="text-xs font-medium text-terracotta">+ {remainingItems} món khác trong đơn</p>}</div><div className="mt-5 grid gap-3 border-t border-primary/10 pt-4 text-sm sm:grid-cols-[1fr_auto] sm:items-center"><p className="text-muted-foreground"><span className="text-foreground">Giao đến:</span> {order.customerAddress}</p><div className="flex items-center gap-4 sm:justify-end"><span className="font-semibold text-primary">{currency.format(Number(order.total))}₫</span><Button variant="outline" size="sm" onClick={() => setLocation(`/account/orders/${order.id}`)}>Theo dõi</Button></div></div></article>; })}</div>}
            </div>}

            {activeTab === "reviews" && <div><div className="mb-6 flex items-end justify-between gap-4"><div><p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-terracotta">Vos mots</p><h2 className="serif-title mt-2 text-3xl text-primary">Đánh giá đã gửi</h2></div><MessageSquareText size={22} className="text-gold" /></div>
              {reviewsLoading ? <ApiLoading label="Đang tải các đánh giá đã gửi" /> : userReviews.length === 0 ? <EmptyState icon={Sparkles} title="Chưa có đánh giá nào" description="Sau khi đơn hàng được giao thành công, bạn có thể chia sẻ cảm nhận của mình về chiếc bánh đã chọn." actionLabel="Xem đơn hàng" onAction={() => setActiveTab("orders")} /> : <div className="space-y-4">{userReviews.map((review) => <article key={review.id} className="border border-primary/10 bg-card p-5 shadow-sm sm:p-6"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-terracotta">{review.productCategory} · Đơn #{review.orderId}</p><h3 className="serif-subtitle mt-1 text-xl text-primary">{review.productName}</h3></div><span className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${review.approved ? "bg-emerald-100 text-emerald-800" : "bg-gold/15 text-primary"}`}>{review.approved ? <CheckCircle2 size={13} /> : <Truck size={13} />}{review.approved ? "Đã công khai" : "Đang chờ duyệt"}</span></div><div className="mt-4 flex items-center gap-1 text-gold" aria-label={`${review.rating} trên 5 sao`}>{Array.from({ length: 5 }, (_, index) => <Star key={index} size={15} fill={index < review.rating ? "currentColor" : "none"} className={index < review.rating ? "" : "text-primary/15"} />)}</div>{review.title && <h4 className="mt-3 font-semibold text-primary">{review.title}</h4>}<p className="mt-2 text-sm leading-6 text-muted-foreground">{review.content}</p><div className="mt-4 flex items-center justify-between border-t border-primary/10 pt-3 text-xs text-muted-foreground"><span>Gửi ngày {new Date(review.createdAt).toLocaleDateString("vi-VN")}</span>{review.verifiedPurchase && <span className="font-semibold text-primary">Mua hàng đã xác minh</span>}</div></article>)}</div>}
            </div>}

            {activeTab === "favorites" && <div><div className="mb-6 flex items-end justify-between gap-4"><div><p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-terracotta">La sélection</p><h2 className="serif-title mt-2 text-3xl text-primary">Danh sách yêu thích</h2></div><Heart size={22} className="text-gold" /></div>
              {favoritesLoading ? <ApiLoading label="Đang tải danh sách yêu thích" /> : userFavorites.length === 0 ? <EmptyState icon={Heart} title="Danh sách đang trống" description="Lưu lại những sáng tạo bạn muốn thưởng thức vào một dịp thật vừa vặn." actionLabel="Khám phá bộ sưu tập" onAction={startShopping} /> : <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{userFavorites.map((favorite) => <article key={favorite.productId} className="overflow-hidden border border-primary/10 bg-card shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg"><img src={favorite.product.imageUrl} alt={favorite.product.name} className="aspect-square w-full object-cover" /><div className="p-4"><p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-terracotta">{favorite.product.category}</p><h3 className="serif-subtitle mt-1 text-lg text-primary">{favorite.product.name}</h3><p className="mt-1 text-sm text-muted-foreground">{currency.format(Number(favorite.product.price))}₫</p><Button size="sm" onClick={() => addFavoriteToCart(favorite)} className="btn-primary mt-4 w-full">Thêm vào giỏ</Button></div></article>)}</div>}
            </div>}
            </>}
          </section>
        </div>
      </main>
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} items={items} onUpdateQuantity={updateQuantity} onRemoveItem={removeItem} onCheckout={() => { setCartOpen(false); setLocation("/checkout"); }} />
    </div>
  );
}
