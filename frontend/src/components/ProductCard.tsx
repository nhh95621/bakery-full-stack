import { ArrowUpRight, Heart, Plus } from "lucide-react";
import { useState } from "react";

interface ProductCardProps {
  id: number;
  name: string;
  subtitle: string;
  price: number;
  originalPrice?: number;
  image: string;
  tag?: string;
  tagColor?: string;
  rating: number;
  reviewCount: number;
  liked: boolean;
  liking?: boolean;
  onLike: (id: number) => void;
  onAddToCart: (id: number) => void;
  onViewDetail: (id: number) => void;
}

export default function ProductCard({ id, name, subtitle, price, originalPrice, image, tag, liked, liking = false, onLike, onAddToCart, onViewDetail }: ProductCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const discountPercent = originalPrice ? Math.round((1 - price / originalPrice) * 100) : 0;

  return (
    <article className="group flex h-full flex-col bg-card p-3 text-card-foreground shadow-[0_15px_40px_rgba(20,10,5,0.12)] transition-transform duration-300 hover:-translate-y-1">
      <div className="relative aspect-[4/5] cursor-pointer overflow-hidden bg-[#eadbca]" onClick={() => onViewDetail(id)}>
        <img src={image} alt={name} onLoad={() => setImageLoaded(true)} className={`h-full w-full object-cover transition duration-700 group-hover:scale-[1.045] ${imageLoaded ? "opacity-100" : "opacity-0"}`} />
        {!imageLoaded && <div className="absolute inset-0 animate-pulse bg-muted" />}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/15 via-transparent to-transparent" />
        {tag && <span className="absolute left-3 top-3 bg-primary px-2.5 py-1 text-[9px] font-semibold tracking-[0.22em] text-primary-foreground">{tag}</span>}
        {originalPrice && discountPercent > 0 && <span className="absolute bottom-3 left-3 bg-terracotta px-2 py-1 text-[9px] font-semibold tracking-[0.14em] text-white">GIẢM {discountPercent}%</span>}
        <button type="button" onClick={(event) => { event.stopPropagation(); onLike(id); }} disabled={liking} aria-label={liked ? "Bỏ yêu thích" : "Thêm yêu thích"} className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-primary/15 bg-card/90 backdrop-blur-sm transition-colors ${liked ? "text-rose-500" : "text-primary hover:bg-gold"} ${liking ? "cursor-not-allowed opacity-50" : ""}`}>
          <Heart size={15} fill={liked ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="flex flex-1 flex-col px-1 pb-1 pt-5">
        <p className="text-[9px] font-semibold tracking-[0.2em] text-terracotta uppercase">{subtitle}</p>
        <h3 className="mt-2 cursor-pointer font-serif text-2xl leading-[0.95] tracking-[-0.025em] transition-colors hover:text-terracotta" onClick={() => onViewDetail(id)}>{name}</h3>
        <div className="mt-6 flex items-end justify-between gap-3 border-t border-border pt-4">
          <div>
            <p className="text-lg font-semibold text-primary">{price.toLocaleString("vi-VN")}₫</p>
            {originalPrice && <p className="mt-1 text-xs text-muted-foreground line-through">{originalPrice.toLocaleString("vi-VN")}₫</p>}
          </div>
          <button type="button" onClick={() => onAddToCart(id)} className="inline-flex items-center gap-1.5 border border-primary bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-terracotta hover:border-terracotta active:scale-95">
            <Plus size={14} /> Thêm <ArrowUpRight size={13} />
          </button>
        </div>
      </div>
    </article>
  );
}
