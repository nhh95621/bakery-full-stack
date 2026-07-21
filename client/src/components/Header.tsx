import { useState } from "react";
import { Search, ShoppingBag, Heart, Menu, X, LogOut, LogIn } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  cartCount: number;
  onCartClick: () => void;
  onSearchChange: (query: string) => void;
  favoriteCount?: number;
}

export default function Header({
  cartCount,
  onCartClick,
  onSearchChange,
  favoriteCount = 0,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-background border-b border-border">
      <div className="container py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/">
            <a className="flex-shrink-0">
              <h1 className="serif-title text-2xl">Boulangerie</h1>
            </a>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8 flex-1">
            <nav className="flex gap-6">
              <Link href="/">
                <a className="text-sm hover:text-primary transition-colors">
                  Trang Chủ
                </a>
              </Link>
              <a href="#products" className="text-sm hover:text-primary transition-colors">
                Sản Phẩm
              </a>
              <a href="#about" className="text-sm hover:text-primary transition-colors">
                Về Chúng Tôi
              </a>
            </nav>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:flex items-center flex-1 max-w-xs">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Tìm kiếm..."
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded bg-muted text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Favorites */}
            <Link href="/favorites">
              <a className="relative p-2 hover:bg-muted rounded transition-colors">
                <Heart className="w-5 h-5" />
                {favoriteCount > 0 && (
                  <span className="absolute top-0 right-0 w-5 h-5 bg-accent text-accent-foreground text-xs flex items-center justify-center rounded-full">
                    {favoriteCount}
                  </span>
                )}
              </a>
            </Link>

            {/* Cart */}
            <button
              onClick={onCartClick}
              className="relative p-2 hover:bg-muted rounded transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 w-5 h-5 bg-primary text-primary-foreground text-xs font-semibold flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Menu */}
            <div className="hidden sm:flex items-center gap-2">
              {user ? (
                <>
                  <Link href="/account">
                    <a className="text-sm hover:text-primary transition-colors px-3 py-2">
                      {user.name || user.email}
                    </a>
                  </Link>
                  <button
                    onClick={() => logout()}
                    className="p-2 hover:bg-muted rounded transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => startLogin()}
                  className="p-2 hover:bg-muted rounded transition-colors flex items-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span className="text-sm">Đăng Nhập</span>
                </button>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-muted rounded transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-border space-y-4">
            <nav className="flex flex-col gap-3">
              <Link href="/">
                <a className="text-sm hover:text-primary transition-colors">
                  Trang Chủ
                </a>
              </Link>
              <a href="#products" className="text-sm hover:text-primary transition-colors">
                Sản Phẩm
              </a>
              <a href="#about" className="text-sm hover:text-primary transition-colors">
                Về Chúng Tôi
              </a>
            </nav>

            {/* Search Bar - Mobile */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Tìm kiếm..."
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded bg-muted text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            {/* Mobile User Menu */}
            <div className="pt-4 border-t border-border">
              {user ? (
                <>
                  <Link href="/account">
                    <a className="block text-sm hover:text-primary transition-colors py-2">
                      {user.name || user.email}
                    </a>
                  </Link>
                  <button
                    onClick={() => logout()}
                    className="w-full text-left text-sm hover:text-primary transition-colors py-2 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Đăng Xuất
                  </button>
                </>
              ) : (
                <button
                  onClick={() => startLogin()}
                  className="w-full text-left text-sm hover:text-primary transition-colors py-2 flex items-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  Đăng Nhập
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
