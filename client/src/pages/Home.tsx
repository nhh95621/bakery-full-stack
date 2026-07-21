import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const CATEGORIES = ["Tất Cả", "Entremet", "Tart", "Macaron", "Theo Mùa"];

interface CartItem {
  productId: number;
  name: string;
  price: number;
  image: string;
  size: string;
  quantity: number;
}

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("Tất Cả");
  const [searchQuery, setSearchQuery] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);

  // Fetch products
  const { data: products = [], isLoading: productsLoading } = trpc.products.list.useQuery({
    category: selectedCategory === "Tất Cả" ? undefined : selectedCategory,
    search: searchQuery || undefined,
  });

  // Fetch user favorites
  const { data: userFavorites = [] } = trpc.favorites.list.useQuery();
  const favoriteIds = useMemo(() => userFavorites.map((f: any) => f.productId), [userFavorites]);

  // Add to cart
  const handleAddToCart = (productId: number) => {
    const product = products.find((p: any) => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(
      (item) => item.productId === productId && item.size === product.sizes?.[0]
    );

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.productId === productId && item.size === product.sizes?.[0]
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          productId,
          name: product.name,
          price: parseFloat(product.price),
          image: product.imageUrl,
          size: product.sizes?.[0] || "Default",
          quantity: 1,
        },
      ]);
    }
  };

  // Toggle favorite
  const addFavoriteMutation = trpc.favorites.add.useMutation();
  const removeFavoriteMutation = trpc.favorites.remove.useMutation();

  const handleToggleFavorite = (productId: number) => {
    if (favoriteIds.includes(productId)) {
      removeFavoriteMutation.mutate({ productId });
      setFavorites(favorites.filter((id) => id !== productId));
    } else {
      addFavoriteMutation.mutate({ productId });
      setFavorites([...favorites, productId]);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        onCartClick={() => setCartOpen(!cartOpen)}
        onSearchChange={setSearchQuery}
        favoriteCount={favoriteIds.length}
      />

      {/* Hero Banner */}
      <section className="relative h-96 bg-gradient-to-r from-amber-50 to-orange-50 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-20 w-72 h-72 bg-accent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-10 w-96 h-96 bg-amber-200 rounded-full blur-3xl" />
        </div>

        <div className="container relative z-10 text-center">
          <h1 className="serif-title text-5xl md:text-6xl mb-4">Boulangerie</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Bánh ngọt cao cấp, tươi mới mỗi ngày
          </p>
          <a href="#products" className="btn-outline inline-block">
            Khám Phá Sản Phẩm
          </a>
        </div>
      </section>

      {/* Category Filter */}
      <section className="container py-8">
        <div className="flex gap-3 overflow-x-auto pb-2">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`whitespace-nowrap px-6 py-2 text-sm font-medium transition-all ${
                selectedCategory === category
                  ? "bg-foreground text-background"
                  : "border border-border hover:border-foreground"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* Products Grid */}
      <section id="products" className="container py-12">
        {productsLoading ? (
          <div className="flex justify-center items-center h-96">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Không có sản phẩm nào</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product: any) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                subtitle={product.subtitle || ""}
                price={parseFloat(product.price)}
                originalPrice={product.originalPrice ? parseFloat(product.originalPrice) : undefined}
                image={product.imageUrl}
                tag={product.tag}
                tagColor={product.tagColor}
                rating={parseFloat(product.rating || "5.0")}
                reviewCount={product.reviewCount || 0}
                liked={favoriteIds.includes(product.id)}
                onLike={handleToggleFavorite}
                onAddToCart={handleAddToCart}
                onViewDetail={(id) => {
                  // TODO: Navigate to product detail
                }}
              />
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-16">
        <div className="container py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="serif-subtitle mb-4">Boulangerie</h3>
              <p className="text-sm text-muted-foreground">
                Bánh ngọt cao cấp được chế biến từ những nguyên liệu tốt nhất
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Liên Kết</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    Về Chúng Tôi
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    Liên Hệ
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    Chính Sách
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Liên Hệ</h4>
              <p className="text-sm text-muted-foreground">
                Email: hello@boulangerie.com
                <br />
                Phone: +84 (0) 123 456 789
              </p>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2026 Boulangerie. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Cart Drawer - Placeholder */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="flex-1 bg-foreground/40 backdrop-blur-sm"
            onClick={() => setCartOpen(false)}
          />
          <div className="w-full max-w-[400px] bg-background flex flex-col shadow-2xl animate-slide-in-right">
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <h2 className="serif-subtitle text-lg">Giỏ Hàng</h2>
              <button
                onClick={() => setCartOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {cart.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">Giỏ hàng trống</p>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={`${item.productId}-${item.size}`} className="flex gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover bg-muted"
                      />
                      <div className="flex-1">
                        <p className="font-serif text-sm">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.size}</p>
                        <p className="text-sm font-semibold mt-1">
                          {item.price.toLocaleString("vi-VN")}₫ x {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {cart.length > 0 && (
              <div className="border-t border-border p-6 space-y-4">
                <div className="flex justify-between">
                  <span>Tổng cộng:</span>
                  <span className="font-semibold">
                    {cart
                      .reduce((sum, item) => sum + item.price * item.quantity, 0)
                      .toLocaleString("vi-VN")}
                    ₫
                  </span>
                </div>
                <Button className="w-full btn-primary">Thanh Toán</Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
