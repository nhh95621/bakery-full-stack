import { useMemo, useState } from "react";
import { ArrowDownRight, ArrowUpDown, ArrowUpRight, Loader2, Search, SlidersHorizontal, X } from "lucide-react";
import { toast } from "sonner";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { filterAndSortProducts, PRICE_RANGES, SORT_OPTIONS } from "@/lib/catalogue";
import type { PriceRange, SortOption } from "@/lib/catalogue";
import { useCart } from "@/contexts/CartContext";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import ProductDetailModal from "@/components/ProductDetailModal";
import CartDrawer from "@/components/CartDrawer";

const CATEGORIES = [
  { name: "Entremet", description: "Mousse & tầng vị", number: "01" },
  { name: "Tart", description: "Trái cây & bơ", number: "02" },
  { name: "Macaron", description: "Sắc màu tinh tế", number: "03" },
  { name: "Theo Mùa", description: "Phiên bản giới hạn", number: "04" },
];

const CATEGORY_VISUALS: Record<string, string> = {
  Entremet: "/manus-storage/boulangerie-entremet_817fb18e.jpg",
  Tart: "/manus-storage/boulangerie-tart_423ccad2.jpg",
  Macaron: "/manus-storage/boulangerie-macaron_4b6a457e.jpg",
  "Theo Mùa": "/manus-storage/boulangerie-seasonal_44f7b438.jpg",
};

const HERO_VISUAL = "/manus-storage/boulangerie-hero-patisserie_1a4041f8.jpg";

function productImage(product: any) {
  return CATEGORY_VISUALS[product.category] || product.imageUrl;
}

export default function Products() {
  const [, setLocation] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(() => new URLSearchParams(window.location.search).get("category") || undefined);
  const [searchQuery, setSearchQuery] = useState(() => new URLSearchParams(window.location.search).get("q") || "");
  const [priceRange, setPriceRange] = useState<PriceRange>("all");
  const [sortOption, setSortOption] = useState<SortOption>("default");
  const [cartOpen, setCartOpen] = useState(false);
  const [detailProduct, setDetailProduct] = useState<any | null>(null);
  const { items: cart, itemCount, addItem, updateQuantity, removeItem } = useCart();
  const trpcUtils = trpc.useUtils();

  const { data: products = [], isLoading: productsLoading } = trpc.products.list.useQuery({
    category: selectedCategory,
    search: searchQuery || undefined,
  });
  const { data: userFavorites = [] } = trpc.favorites.list.useQuery();
  const allProducts = products as any[];
  const visibleProducts = useMemo(
    () => filterAndSortProducts(allProducts, priceRange, sortOption),
    [allProducts, priceRange, sortOption]
  );
  const favoriteIds = useMemo(() => userFavorites.map((favorite: any) => favorite.productId), [userFavorites]);
  const suggestions = useMemo(
    () => allProducts.slice(0, 5).map((product) => ({
      id: product.id,
      name: product.name,
      subtitle: product.subtitle,
      image: productImage(product),
      price: parseFloat(product.price),
    })),
    [allProducts]
  );

  const addFavoriteMutation = trpc.favorites.add.useMutation({
    onSuccess: async () => {
      await trpcUtils.favorites.list.invalidate();
      toast.success("Đã thêm vào yêu thích", { description: "Bạn có thể xem lại trong tài khoản của mình." });
    },
    onError: (error) => toast.error(error.message || "Không thể thêm sản phẩm vào yêu thích."),
  });
  const removeFavoriteMutation = trpc.favorites.remove.useMutation({
    onSuccess: async () => {
      await trpcUtils.favorites.list.invalidate();
      toast.success("Đã bỏ khỏi yêu thích");
    },
    onError: (error) => toast.error(error.message || "Không thể cập nhật danh sách yêu thích."),
  });

  const addToCart = (productId: number, size?: string, quantity = 1) => {
    const product = allProducts.find((item) => item.id === productId);
    if (!product) return;
    const defaultSize = product.sizes ? product.sizes.split(",")[0].trim() : "Mặc định";
    addItem({
      productId,
      name: product.name,
      price: parseFloat(product.price),
      image: productImage(product),
      size: size || defaultSize,
      quantity,
    });
    toast.success("Đã thêm vào giỏ hàng", {
      description: `${product.name} · ${parseFloat(product.price).toLocaleString("vi-VN")}₫`,
    });
  };

  const clearFilters = () => {
    setSelectedCategory(undefined);
    setSearchQuery("");
    setPriceRange("all");
    setSortOption("default");
  };

  const hasActiveFilter = Boolean(selectedCategory || searchQuery || priceRange !== "all" || sortOption !== "default");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header
        cartCount={itemCount}
        onCartClick={() => setCartOpen((open) => !open)}
        onSearchChange={setSearchQuery}
        favoriteCount={favoriteIds.length}
        suggestions={suggestions}
        onSuggestionSelect={(suggestion) => setSearchQuery(suggestion.name)}
      />

      {cartOpen && (
        <CartDrawer
          isOpen={cartOpen}
          items={cart}
          onClose={() => setCartOpen(false)}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeItem}
          onCheckout={() => {
            setCartOpen(false);
            setLocation("/checkout");
          }}
        />
      )}

      {detailProduct && (
        <ProductDetailModal
          product={{
            id: detailProduct.id,
            name: detailProduct.name,
            subtitle: detailProduct.subtitle || "Boulangerie selection",
            description: detailProduct.description || "Một sáng tạo được hoàn thiện từ nguyên liệu tuyển chọn.",
            price: parseFloat(detailProduct.price),
            originalPrice: detailProduct.originalPrice ? parseFloat(detailProduct.originalPrice) : undefined,
            imageUrl: productImage(detailProduct),
            rating: parseFloat(detailProduct.rating || 0),
            reviewCount: detailProduct.reviewCount || 0,
            sizes: detailProduct.sizes ? detailProduct.sizes.split(",").map((size: string) => size.trim()) : ["Mặc định"],
          }}
          onClose={() => setDetailProduct(null)}
          onAddToCart={addToCart}
        />
      )}

      <main>
        <section className="relative isolate overflow-hidden bg-primary text-primary-foreground">
          <div className="pointer-events-none absolute inset-0 opacity-70 [background-image:radial-gradient(circle_at_10%_80%,rgba(201,119,75,.30),transparent_28%),radial-gradient(circle_at_88%_18%,rgba(214,173,115,.22),transparent_24%)]" />
          <div className="container relative grid gap-10 py-16 md:py-20 lg:grid-cols-[1.1fr_.9fr] lg:items-end lg:py-24">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 text-[10px] font-semibold tracking-[0.22em] text-gold"><Link href="/" className="transition-colors hover:text-primary-foreground">TRANG CHỦ</Link><span className="h-px w-7 bg-gold/70" /> LA CARTE</div>
              <p className="section-eyebrow mt-10 text-gold">Bộ sưu tập Boulangerie</p>
              <h1 className="mt-4 font-serif text-[clamp(4rem,8vw,7.4rem)] leading-[0.82] tracking-[-0.065em]">Những lớp vị<br /><em className="text-gold">để nhớ.</em></h1>
              <p className="mt-7 max-w-xl text-base leading-8 text-primary-foreground/70 md:text-lg">Lựa chọn chiếc bánh dành cho buổi tiệc, món quà hay đơn giản là một khoảng lặng thật ngọt ngào trong ngày.</p>
            </div>
            <div className="relative hidden justify-self-end lg:block">
              <div className="absolute -left-5 -top-5 h-full w-full border border-gold/50" />
              <img src={HERO_VISUAL} alt="Sáng tạo bánh ngọt của Boulangerie" className="relative h-60 w-72 object-cover opacity-85 mix-blend-luminosity" />
            </div>
          </div>
        </section>

        <section className="border-b border-border bg-[#dec1a2]">
          <div className="container grid gap-5 py-5 text-sm text-primary md:grid-cols-3 md:gap-0 md:divide-x md:divide-primary/20">
            <div className="md:pr-8"><span className="mr-3 font-serif text-2xl text-terracotta">01</span><span className="font-semibold">Chọn dòng bánh</span><span className="ml-2 text-primary/65">theo gu của bạn</span></div>
            <div className="md:px-8"><span className="mr-3 font-serif text-2xl text-terracotta">02</span><span className="font-semibold">Khám phá chi tiết</span><span className="ml-2 text-primary/65">về vị và kích thước</span></div>
            <div className="md:pl-8"><span className="mr-3 font-serif text-2xl text-terracotta">03</span><span className="font-semibold">Thêm vào giỏ</span><span className="ml-2 text-primary/65">khi đã sẵn sàng</span></div>
          </div>
        </section>

        <section className="paper-grain py-12 md:py-20">
          <div className="container">
            <div className="mb-8 flex items-end justify-between gap-4 lg:hidden">
              <div><p className="section-eyebrow">Danh mục</p><h2 className="mt-2 font-serif text-4xl">La carte</h2></div>
              {hasActiveFilter && <button type="button" onClick={clearFilters} className="text-xs font-semibold text-terracotta underline underline-offset-4">Xóa lọc</button>}
            </div>

            <div className="grid gap-10 lg:grid-cols-[245px_minmax(0,1fr)] lg:gap-14">
              <aside className="hidden lg:block">
                <div className="sticky top-44">
                  <p className="section-eyebrow">Danh mục</p>
                  <h2 className="mt-3 font-serif text-5xl leading-[0.9] tracking-[-0.05em]">La<br />carte.</h2>
                  <div className="mt-10 border-t border-foreground/15">
                    <button type="button" onClick={() => setSelectedCategory(undefined)} className={`flex w-full items-center justify-between border-b border-foreground/15 py-4 text-left text-sm transition-colors ${!selectedCategory ? "font-semibold text-terracotta" : "hover:text-terracotta"}`}><span>Tất cả sáng tạo</span><span className="font-serif text-lg">00</span></button>
                    {CATEGORIES.map((category) => (
                      <button key={category.name} type="button" onClick={() => setSelectedCategory(category.name)} className={`flex w-full items-center justify-between border-b border-foreground/15 py-4 text-left text-sm transition-colors ${selectedCategory === category.name ? "font-semibold text-terracotta" : "hover:text-terracotta"}`}><span>{category.name}</span><span className="font-serif text-lg">{category.number}</span></button>
                    ))}
                  </div>
                  <div className="mt-9 border-t border-foreground/15 pt-6">
                    <p className="text-[10px] font-semibold tracking-[0.18em] text-muted-foreground">KHOẢNG GIÁ</p>
                    <div className="mt-3 space-y-1">
                      {PRICE_RANGES.map((range) => (
                        <button key={range.value} type="button" onClick={() => setPriceRange(range.value)} className={`flex w-full items-center gap-3 py-2 text-left text-sm transition-colors ${priceRange === range.value ? "font-semibold text-terracotta" : "text-foreground/75 hover:text-terracotta"}`}>
                          <span className={`h-2 w-2 rounded-full border ${priceRange === range.value ? "border-terracotta bg-terracotta" : "border-foreground/35"}`} />
                          {range.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  {hasActiveFilter && <button type="button" onClick={clearFilters} className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-terracotta"><X size={14} /> Xóa bộ lọc</button>}
                </div>
              </aside>

              <div>
                <div className="mb-8 flex gap-2 overflow-x-auto pb-2 lg:hidden">
                  <button type="button" onClick={() => setSelectedCategory(undefined)} className={`shrink-0 border px-4 py-2 text-xs font-semibold ${!selectedCategory ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card"}`}>Tất cả</button>
                  {CATEGORIES.map((category) => <button key={category.name} type="button" onClick={() => setSelectedCategory(category.name)} className={`shrink-0 border px-4 py-2 text-xs font-semibold ${selectedCategory === category.name ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card"}`}>{category.name}</button>)}
                </div>

                <div className="mb-9 flex flex-col justify-between gap-5 border-b border-foreground/15 pb-5 md:flex-row md:items-end">
                  <div>
                    <p className="section-eyebrow text-terracotta">{selectedCategory || "Tất cả bộ sưu tập"}</p>
                    <h2 className="mt-2 font-serif text-4xl tracking-[-0.04em] md:text-5xl">{visibleProducts.length} lựa chọn đang chờ bạn.</h2>
                  </div>
                  <label className="relative block w-full md:max-w-xs">
                    <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} type="search" placeholder="Tìm theo tên hoặc hương vị" className="w-full border-b border-foreground/25 bg-transparent py-3 pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-terracotta" />
                  </label>
                </div>

                <div className="mb-8 grid gap-3 border-b border-foreground/10 pb-6 sm:grid-cols-2">
                  <label className="relative block">
                    <span className="mb-2 flex items-center gap-2 text-[10px] font-semibold tracking-[0.16em] text-muted-foreground"><SlidersHorizontal size={13} /> KHOẢNG GIÁ</span>
                    <select value={priceRange} onChange={(event) => setPriceRange(event.target.value as PriceRange)} className="w-full appearance-none border border-foreground/20 bg-card px-4 py-3 text-sm outline-none transition-colors focus:border-terracotta">
                      {PRICE_RANGES.map((range) => <option key={range.value} value={range.value}>{range.label}</option>)}
                    </select>
                  </label>
                  <label className="relative block">
                    <span className="mb-2 flex items-center gap-2 text-[10px] font-semibold tracking-[0.16em] text-muted-foreground"><ArrowUpDown size={13} /> SẮP XẾP</span>
                    <select value={sortOption} onChange={(event) => setSortOption(event.target.value as SortOption)} className="w-full appearance-none border border-foreground/20 bg-card px-4 py-3 text-sm outline-none transition-colors focus:border-terracotta">
                      {SORT_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                    </select>
                  </label>
                </div>

                {productsLoading ? (
                  <div className="flex justify-center py-24"><Loader2 className="h-8 w-8 animate-spin text-terracotta" /></div>
                ) : visibleProducts.length === 0 ? (
                  <div className="border border-dashed border-foreground/25 bg-card/60 px-6 py-20 text-center"><p className="font-serif text-3xl">Chưa có lựa chọn phù hợp.</p><p className="mt-3 text-sm text-muted-foreground">Thử thay đổi từ khóa hoặc quay về toàn bộ bộ sưu tập.</p><button type="button" onClick={clearFilters} className="mt-7 inline-flex items-center gap-2 bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">Xem toàn bộ <ArrowDownRight size={16} /></button></div>
                ) : (
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {visibleProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        id={product.id}
                        name={product.name}
                        subtitle={product.subtitle || product.category}
                        price={parseFloat(product.price)}
                        originalPrice={product.originalPrice ? parseFloat(product.originalPrice) : undefined}
                        image={productImage(product)}
                        rating={parseFloat(product.rating || 0)}
                        reviewCount={product.reviewCount || 0}
                        tag={product.tag}
                        tagColor={product.tagColor}
                        liked={favoriteIds.includes(product.id)}
                        liking={addFavoriteMutation.isPending || removeFavoriteMutation.isPending}
                        onLike={(productId) => favoriteIds.includes(productId) ? removeFavoriteMutation.mutate({ productId }) : addFavoriteMutation.mutate({ productId })}
                        onAddToCart={(productId) => addToCart(productId)}
                        onViewDetail={(productId) => setDetailProduct(allProducts.find((product) => product.id === productId) || null)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#241711] text-primary-foreground">
        <div className="container py-14 md:py-16"><div className="grid gap-10 md:grid-cols-[1.25fr_.75fr_.75fr]"><div><p className="section-eyebrow text-gold">Depuis 2026</p><h3 className="mt-4 font-serif text-4xl tracking-[-0.04em]">Boulangerie</h3><p className="mt-5 max-w-sm text-sm leading-7 text-primary-foreground/60">Một góc nhỏ dành cho những chiếc bánh cầu kỳ, nguyên liệu chỉn chu và các buổi gặp gỡ đáng nhớ.</p></div><div><h4 className="text-xs font-semibold tracking-[0.18em] text-gold">KHÁM PHÁ</h4><div className="mt-5 flex flex-col gap-3 text-sm text-primary-foreground/65"><Link href="/" className="transition-colors hover:text-gold">Trang Chủ</Link><Link href="/products" className="transition-colors hover:text-gold">Sản Phẩm</Link><Link href="/about" className="transition-colors hover:text-gold">Về Chúng Tôi</Link></div></div><div><h4 className="text-xs font-semibold tracking-[0.18em] text-gold">LIÊN HỆ</h4><div className="mt-5 space-y-3 text-sm text-primary-foreground/65"><p>hello@boulangerie.com</p><p>+84 (0) 123 456 789</p><p>Thứ Hai — Chủ Nhật<br />09:00 — 21:00</p></div></div></div><div className="mt-14 flex flex-col gap-3 border-t border-primary-foreground/15 pt-6 text-xs text-primary-foreground/45 sm:flex-row sm:items-center sm:justify-between"><p>© 2026 Boulangerie. All rights reserved.</p><p>Made slowly, shared generously.</p></div></div>
      </footer>
    </div>
  );
}
