import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useCart } from "@/contexts/CartContext";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import CartDrawer from "@/components/CartDrawer";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const CATEGORIES = ["Tất Cả", "Entremet", "Tart", "Macaron", "Theo Mùa"];

export default function Home() {
  const [, setLocation] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState("Tất Cả");
  const [searchQuery, setSearchQuery] = useState("");
  const [cartOpen, setCartOpen] = useState(false);

  // Use global cart context
  const { items: cart, itemCount, total, addItem, updateQuantity, removeItem } = useCart();

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
    const product = (products as any[]).find((p) => p.id === productId);
    if (!product) return;

    const sizes = product.sizes ? product.sizes.split(",").map((s: string) => s.trim()) : ["Default"];
    const defaultSize = sizes[0];

    addItem({
      productId,
      name: product.name,
      price: parseFloat(product.price),
      image: product.imageUrl,
      size: defaultSize,
      quantity: 1,
    });
  };

  // Toggle favorite
  const addFavoriteMutation = trpc.favorites.add.useMutation();
  const removeFavoriteMutation = trpc.favorites.remove.useMutation();

  const handleToggleFavorite = (productId: number) => {
    if (favoriteIds.includes(productId)) {
      removeFavoriteMutation.mutate({ productId });
    } else {
      addFavoriteMutation.mutate({ productId });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        cartCount={itemCount}
        onCartClick={() => setCartOpen(!cartOpen)}
        onSearchChange={setSearchQuery}
        favoriteCount={favoriteIds.length}
      />

      {/* Cart Drawer */}
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

      {/* Hero Banner */}
      <section className="relative h-96 bg-gradient-to-r from-amber-50 to-orange-50 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-20 w-72 h-72 bg-accent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-10 w-96 h-96 bg-amber-200 rounded-full blur-3xl" />
        </div>

        <div className="container relative z-10 text-center">
          <h1 className="serif-title text-5xl md:text-6xl mb-4">Boulangerie</h1>
          <p className="text-lg text-muted-foreground mb-8">Bánh ngọt cao cấp, tươi mới mỗi ngày</p>
          <Button className="btn-primary" onClick={() => document.querySelector("#products")?.scrollIntoView({ behavior: "smooth" })}>
            Khám Phá Sản Phẩm
          </Button>
        </div>
      </section>

      {/* Category Filter */}
      <section className="border-b border-border">
        <div className="container py-6">
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded border transition-all ${
                  selectedCategory === cat
                    ? "bg-foreground text-background border-foreground"
                    : "bg-background text-foreground border-border hover:border-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section id="products" className="container py-12">
        {productsLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : (products as any[]).length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Không có sản phẩm nào</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(products as any[]).map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                subtitle={product.subtitle}
                price={parseFloat(product.price)}
                originalPrice={product.originalPrice ? parseFloat(product.originalPrice) : undefined}
                image={product.imageUrl}
                rating={parseFloat(product.rating)}
                reviewCount={product.reviewCount}
                tag={product.tag}
                tagColor={product.tagColor}
                liked={favoriteIds.includes(product.id)}
                liking={addFavoriteMutation.isPending || removeFavoriteMutation.isPending}
                onLike={() => handleToggleFavorite(product.id)}
                onAddToCart={() => handleAddToCart(product.id)}
                onViewDetail={() => {}}
              />
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30">
        <div className="container py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="serif-subtitle text-lg mb-4">Boulangerie</h3>
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
              <p className="text-sm text-muted-foreground">Email: hello@boulangerie.com</p>
              <p className="text-sm text-muted-foreground">Phone: +84 (0) 123 456 789</p>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>© 2026 Boulangerie. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
