import { useState } from "react";
import { Search, ShoppingBag, Heart, Menu, X, LogOut, LogIn, ArrowRight } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { Link } from "wouter";

export interface SearchSuggestion {
  id: number;
  name: string;
  subtitle?: string;
  image?: string;
  price?: number;
}

interface HeaderProps {
  cartCount: number;
  onCartClick: () => void;
  onSearchChange: (query: string) => void;
  favoriteCount?: number;
  suggestions?: SearchSuggestion[];
  onSuggestionSelect?: (suggestion: SearchSuggestion) => void;
}

interface SearchBoxProps {
  mobile?: boolean;
  value: string;
  suggestions: SearchSuggestion[];
  onChange: (value: string) => void;
  onSelect: (suggestion: SearchSuggestion) => void;
}

function SearchBox({ mobile = false, value, suggestions, onChange, onSelect }: SearchBoxProps) {
  const [focused, setFocused] = useState(false);
  const showSuggestions = focused && value.trim().length > 0;

  return (
    <div className={`relative ${mobile ? "w-full" : "w-full max-w-xs"}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <input
        type="search"
        value={value}
        placeholder="Tìm kiếm bánh..."
        aria-label="Tìm kiếm sản phẩm"
        autoComplete="off"
        onChange={(event) => onChange(event.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => window.setTimeout(() => setFocused(false), 150)}
        className="w-full pl-10 pr-4 py-2 border border-border rounded bg-muted text-sm focus:outline-none focus:ring-2 focus:ring-accent"
      />

      {showSuggestions && (
        <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50 overflow-hidden rounded border border-border bg-background shadow-xl">
          {suggestions.length > 0 ? (
            <div className="py-1">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion.id}
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => onSelect(suggestion)}
                  className="flex w-full items-center gap-3 px-3 py-3 text-left transition-colors hover:bg-muted"
                >
                  {suggestion.image ? (
                    <img src={suggestion.image} alt="" className="h-10 w-10 rounded object-cover" />
                  ) : (
                    <span className="flex h-10 w-10 items-center justify-center rounded bg-muted text-accent">
                      <Search size={15} />
                    </span>
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">{suggestion.name}</span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {suggestion.subtitle || "Bánh ngọt cao cấp"}
                      {suggestion.price !== undefined ? ` · ${suggestion.price.toLocaleString("vi-VN")}₫` : ""}
                    </span>
                  </span>
                  <ArrowRight size={14} className="shrink-0 text-muted-foreground" />
                </button>
              ))}
            </div>
          ) : (
            <p className="px-4 py-3 text-sm text-muted-foreground">Không tìm thấy sản phẩm phù hợp.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default function Header({
  cartCount,
  onCartClick,
  onSearchChange,
  favoriteCount = 0,
  suggestions = [],
  onSuggestionSelect,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const { user, logout } = useAuth();

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    onSearchChange(value);
  };

  const handleSuggestionSelect = (suggestion: SearchSuggestion) => {
    setSearchValue(suggestion.name);
    onSearchChange(suggestion.name);
    onSuggestionSelect?.(suggestion);
  };

  return (
    <header className="sticky top-0 z-40 bg-background border-b border-border">
      <div className="container py-3 md:py-4">
        <div className="flex justify-center border-b border-border pb-3 md:pb-4">
          <Link href="/" className="inline-flex rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
            <h1 className="serif-title text-2xl tracking-wide md:text-3xl">Boulangerie</h1>
          </Link>
        </div>

        <div className="flex items-center justify-between gap-4 pt-3 md:pt-4">
          <div className="hidden min-w-0 flex-1 md:flex">
            <nav className="flex gap-6">
              <Link href="/" className="text-sm hover:text-primary transition-colors">Trang Chủ</Link>
              <a href="#products" className="text-sm hover:text-primary transition-colors">Sản Phẩm</a>
              <a href="#about" className="text-sm hover:text-primary transition-colors">Về Chúng Tôi</a>
            </nav>
          </div>

          <div className="hidden min-w-0 flex-1 justify-center lg:flex">
            <SearchBox
              value={searchValue}
              suggestions={suggestions}
              onChange={handleSearchChange}
              onSelect={handleSuggestionSelect}
            />
          </div>

          <div className="flex min-w-0 flex-1 items-center justify-end gap-4">
            <Link href="/favorites" className="relative p-2 hover:bg-muted rounded transition-colors" aria-label="Sản phẩm yêu thích">
              <Heart className="w-5 h-5" />
              {favoriteCount > 0 && (
                <span className="absolute top-0 right-0 w-5 h-5 bg-accent text-accent-foreground text-xs flex items-center justify-center rounded-full">
                  {favoriteCount}
                </span>
              )}
            </Link>

            <button onClick={onCartClick} className="relative p-2 hover:bg-muted rounded transition-colors" aria-label="Mở giỏ hàng">
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 w-5 h-5 bg-primary text-primary-foreground text-xs font-semibold flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </button>

            <div className="hidden sm:flex items-center gap-2">
              {user ? (
                <>
                  <Link href="/account" className="text-sm hover:text-primary transition-colors px-3 py-2">{user.name || user.email}</Link>
                  <button onClick={() => logout()} className="p-2 hover:bg-muted rounded transition-colors" aria-label="Đăng xuất">
                    <LogOut className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <button onClick={() => startLogin()} className="p-2 hover:bg-muted rounded transition-colors flex items-center gap-2">
                  <LogIn className="w-4 h-4" />
                  <span className="text-sm">Đăng Nhập</span>
                </button>
              )}
            </div>

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 hover:bg-muted rounded transition-colors" aria-label="Mở menu">
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-border space-y-4">
            <nav className="flex flex-col gap-3">
              <Link href="/" className="text-sm hover:text-primary transition-colors">Trang Chủ</Link>
              <a href="#products" className="text-sm hover:text-primary transition-colors">Sản Phẩm</a>
              <a href="#about" className="text-sm hover:text-primary transition-colors">Về Chúng Tôi</a>
            </nav>

            <SearchBox
              mobile
              value={searchValue}
              suggestions={suggestions}
              onChange={handleSearchChange}
              onSelect={handleSuggestionSelect}
            />

            <div className="pt-4 border-t border-border">
              {user ? (
                <>
                  <Link href="/account" className="block text-sm hover:text-primary transition-colors py-2">{user.name || user.email}</Link>
                  <button onClick={() => logout()} className="w-full text-left text-sm hover:text-primary transition-colors py-2 flex items-center gap-2">
                    <LogOut className="w-4 h-4" /> Đăng Xuất
                  </button>
                </>
              ) : (
                <button onClick={() => startLogin()} className="w-full text-left text-sm hover:text-primary transition-colors py-2 flex items-center gap-2">
                  <LogIn className="w-4 h-4" /> Đăng Nhập
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
