import { useMemo, useState } from "react";
import { ArrowDownRight, ArrowUpRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Link, useLocation } from "wouter";
import { trpc } from "@/services/trpc";
import { useCart } from "@/contexts/CartContext";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import CartDrawer from "@/components/CartDrawer";
import CustomerReviewsCarousel from "@/components/CustomerReviewsCarousel";

const CATEGORIES = [
  { name: "Entremet", label: "Mousse & tầng vị", number: "01" },
  { name: "Tart", label: "Trái cây & bơ", number: "02" },
  { name: "Macaron", label: "Sắc màu tinh tế", number: "03" },
  { name: "Theo Mùa", label: "Phiên bản giới hạn", number: "04" },
];

const CATEGORY_VISUALS: Record<string, string> = {
  Entremet: "/manus-storage/boulangerie-entremet_817fb18e.jpg",
  Tart: "/manus-storage/boulangerie-tart_423ccad2.jpg",
  Macaron: "/manus-storage/boulangerie-macaron_4b6a457e.jpg",
  "Theo Mùa": "/manus-storage/boulangerie-seasonal_44f7b438.jpg",
};

const HERO_VISUAL = "/manus-storage/boulangerie-hero-patisserie_1a4041f8.jpg";

export default function Home() {
  const [, setLocation] = useLocation();
  const [headerSearch, setHeaderSearch] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const { items: cart, itemCount, addItem, updateQuantity, removeItem } = useCart();
  const trpcUtils = trpc.useUtils();
  const productListParams = useMemo(() => ({}), []);

  const { data: products = [], isLoading: productsLoading } = trpc.products.list.useQuery(productListParams);
  const { data: userFavorites = [] } = trpc.favorites.list.useQuery();
  const favoriteIds = useMemo(() => userFavorites.map((favorite: any) => favorite.productId), [userFavorites]);
  const allProducts = products as any[];
  const heroProduct = allProducts[0];
  const productVisual = (product: any) => CATEGORY_VISUALS[product.category] || product.imageUrl;

  const searchSuggestions = useMemo(() => {
    const normalizedQuery = headerSearch.trim().toLocaleLowerCase("vi-VN");
    return allProducts
      .filter((product) => !normalizedQuery || [product.name, product.subtitle, product.category].filter(Boolean).some((value) => String(value).toLocaleLowerCase("vi-VN").includes(normalizedQuery)))
      .slice(0, 5)
      .map((product) => ({
      id: product.id,
      name: product.name,
      subtitle: product.subtitle,
      image: productVisual(product),
      price: parseFloat(product.price),
      }));
  }, [allProducts, headerSearch]);
  const featuredProducts = allProducts.slice(0, 3);

  const handleAddToCart = (productId: number) => {
    const product = allProducts.find((item) => item.id === productId);
    if (!product) return;
    const sizes = product.sizes ? product.sizes.split(",").map((size: string) => size.trim()) : ["Default"];
    addItem({ productId, name: product.name, price: parseFloat(product.price), image: product.imageUrl, size: sizes[0], quantity: 1 });
    toast.success("Đã thêm vào giỏ hàng", { description: `${product.name} · ${parseFloat(product.price).toLocaleString("vi-VN")}₫` });
  };

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

  const handleToggleFavorite = (productId: number) => {
    if (favoriteIds.includes(productId)) removeFavoriteMutation.mutate({ productId });
    else addFavoriteMutation.mutate({ productId });
  };

  const goToCatalogue = (category?: string) => {
    setLocation(category ? `/products?category=${encodeURIComponent(category)}` : "/products");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        cartCount={itemCount}
        onCartClick={() => setCartOpen((open) => !open)}
        onSearchChange={setHeaderSearch}
        favoriteCount={favoriteIds.length}
        suggestions={searchSuggestions}
        onSuggestionSelect={(suggestion) => {
          setLocation(`/products?q=${encodeURIComponent(suggestion.name)}`);
        }}
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

      <main>
        <section className="relative isolate overflow-hidden bg-primary text-primary-foreground">
          <div className="pointer-events-none absolute inset-0 opacity-70 [background-image:radial-gradient(circle_at_10%_20%,rgba(214,173,115,.25),transparent_20%),radial-gradient(circle_at_90%_80%,rgba(201,119,75,.28),transparent_26%)]" />
          <div className="pointer-events-none absolute -left-8 top-16 font-serif text-[18rem] leading-none text-white/[0.035] md:text-[29rem]">B</div>
          <div className="container relative grid min-h-[600px] items-center gap-10 py-14 lg:grid-cols-[1.02fr_0.98fr] lg:py-20">
            <div className="max-w-2xl">
              <p className="section-eyebrow text-gold">Pâtisserie contemporaine · Saigon</p>
              <h1 className="mt-6 font-serif text-[clamp(4.1rem,9vw,8.7rem)] leading-[0.78] tracking-[-0.065em]">Một chút<br />ngọt ngào,<br /><em className="text-gold">rất nhiều</em> ký ức.</h1>
              <p className="mt-9 max-w-md text-base leading-8 text-primary-foreground/70 md:text-lg">Những chiếc bánh được hoàn thiện từng lớp, từ nguyên liệu theo mùa đến nét chấm phá cuối cùng của người thợ.</p>
              <div className="mt-10 flex flex-wrap gap-4">
                <button type="button" onClick={() => goToCatalogue()} className="inline-flex items-center gap-3 bg-gold px-5 py-3 text-sm font-semibold text-cocoa transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.97]">
                  Khám phá bộ sưu tập <ArrowDownRight size={17} />
                </button>
                <Link href="/about" className="inline-flex items-center gap-3 border border-primary-foreground/30 px-5 py-3 text-sm font-medium text-primary-foreground transition-colors hover:border-gold hover:text-gold">
                  Câu chuyện Boulangerie <ArrowUpRight size={17} />
                </Link>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[465px] lg:mr-0">
              <div className="absolute -left-5 -top-5 h-full w-full border border-gold/50" />
              <div className="relative aspect-[4/5] overflow-hidden bg-rosewood">
                {heroProduct ? (
                  <img src={HERO_VISUAL} alt="Bộ sưu tập bánh ngọt Boulangerie" className="h-full w-full object-cover mix-blend-luminosity opacity-85" />
                ) : (
                  <div className="flex h-full items-center justify-center font-serif text-[10rem] text-primary-foreground/10">B</div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                  <p className="section-eyebrow text-gold">Sélection du jour</p>
                  <p className="mt-2 font-serif text-3xl leading-none">{heroProduct?.name || "L'art du dessert"}</p>
                  <p className="mt-3 max-w-xs text-sm leading-6 text-primary-foreground/65">Một lát bánh là sự cân bằng giữa kết cấu, hương thơm và khoảnh khắc.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-border bg-[#ead9c5]">
          <div className="container py-10 md:py-12">
            <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p className="section-eyebrow">Khám phá theo cảm hứng</p>
                <h2 className="serif-title mt-3 text-3xl md:text-4xl">Bốn chương vị giác</h2>
              </div>
              <button type="button" onClick={() => goToCatalogue()} className="inline-flex items-center gap-2 text-sm font-semibold text-foreground underline decoration-gold decoration-2 underline-offset-8">Xem toàn bộ <ArrowDownRight size={16} /></button>
            </div>
            <div className="grid gap-px border border-foreground/15 bg-foreground/15 sm:grid-cols-2 lg:grid-cols-4">
              {CATEGORIES.map((category) => (
                <button
                  key={category.name}
                  type="button"
                  onClick={() => goToCatalogue(category.name)}
                  className="group min-h-36 bg-[#f8ecdf] p-5 text-left transition-colors duration-200 hover:bg-primary hover:text-primary-foreground"
                >
                  <span className="text-xs tracking-[0.2em] text-terracotta group-hover:text-gold">{category.number}</span>
                  <span className="mt-7 block font-serif text-3xl leading-none">{category.name}</span>
                  <span className="mt-3 block text-sm text-muted-foreground group-hover:text-primary-foreground/65">{category.label}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-primary py-16 text-primary-foreground md:py-24">
          <div className="container">
            <div className="mb-10 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between">
              <div className="max-w-xl">
                <p className="section-eyebrow text-gold">Quelques créations</p>
                <h2 className="mt-4 font-serif text-5xl leading-[0.9] tracking-[-0.045em] md:text-6xl">Một vài sáng tạo<br />cho hôm nay.</h2>
              </div>
              <div className="max-w-sm"><p className="text-sm leading-7 text-primary-foreground/65">Chỉ là một lát cắt nhỏ từ La Carte của chúng tôi. Khám phá đầy đủ khi bạn đã sẵn sàng.</p><Link href="/products" className="mt-6 inline-flex items-center gap-2 border-b border-gold pb-2 text-sm font-semibold text-gold transition-colors hover:text-primary-foreground">Xem Trang Sản Phẩm <ArrowUpRight size={16} /></Link></div>
            </div>

            {productsLoading ? (
              <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-gold" /></div>
            ) : featuredProducts.length === 0 ? (
              <div className="border border-primary-foreground/15 py-16 text-center text-primary-foreground/65">Không có sản phẩm nào phù hợp với lựa chọn này.</div>
            ) : (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                {featuredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    subtitle={product.subtitle}
                    price={parseFloat(product.price)}
                    originalPrice={product.originalPrice ? parseFloat(product.originalPrice) : undefined}
                    image={productVisual(product)}
                    rating={parseFloat(product.rating)}
                    reviewCount={product.reviewCount}
                    tag={product.tag}
                    tagColor={product.tagColor}
                    liked={favoriteIds.includes(product.id)}
                    liking={addFavoriteMutation.isPending || removeFavoriteMutation.isPending}
                    onLike={() => handleToggleFavorite(product.id)}
                    onAddToCart={() => handleAddToCart(product.id)}
                    onViewDetail={() => setLocation(`/products?q=${encodeURIComponent(product.name)}`)}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        <CustomerReviewsCarousel />
      </main>

      <footer className="bg-[#241711] text-primary-foreground">
        <div className="container py-14 md:py-16">
          <div className="grid gap-10 md:grid-cols-[1.25fr_.75fr_.75fr]">
            <div>
              <p className="section-eyebrow text-gold">Depuis 2026</p>
              <h3 className="mt-4 font-serif text-4xl tracking-[-0.04em]">Boulangerie</h3>
              <p className="mt-5 max-w-sm text-sm leading-7 text-primary-foreground/60">Một góc nhỏ dành cho những chiếc bánh cầu kỳ, nguyên liệu chỉn chu và các buổi gặp gỡ đáng nhớ.</p>
            </div>
            <div>
              <h4 className="text-xs font-semibold tracking-[0.18em] text-gold">KHÁM PHÁ</h4>
              <div className="mt-5 flex flex-col gap-3 text-sm text-primary-foreground/65">
                <Link href="/" className="transition-colors hover:text-gold">Trang Chủ</Link>
                <Link href="/products" className="transition-colors hover:text-gold">Sản Phẩm</Link>
                <Link href="/about" className="transition-colors hover:text-gold">Về Chúng Tôi</Link>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-semibold tracking-[0.18em] text-gold">LIÊN HỆ</h4>
              <div className="mt-5 space-y-3 text-sm text-primary-foreground/65">
                <p>hello@boulangerie.com</p>
                <p>+84 (0) 123 456 789</p>
                <p>Thứ Hai — Chủ Nhật<br />09:00 — 21:00</p>
              </div>
            </div>
          </div>
          <div className="mt-14 flex flex-col gap-3 border-t border-primary-foreground/15 pt-6 text-xs text-primary-foreground/45 sm:flex-row sm:items-center sm:justify-between"><p>© 2026 Boulangerie. All rights reserved.</p><p>Made slowly, shared generously.</p></div>
        </div>
      </footer>
    </div>
  );
}
