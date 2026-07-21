import { useState } from "react";
import { Heart, Star, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

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

export default function ProductCard({
  id,
  name,
  subtitle,
  price,
  originalPrice,
  image,
  tag,
  tagColor,
  rating,
  reviewCount,
  liked,
  liking = false,
  onLike,
  onAddToCart,
  onViewDetail,
}: ProductCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const discountPercent = originalPrice ? Math.round((1 - price / originalPrice) * 100) : 0;

  return (
    <article className="group bg-card border border-border flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Image */}
      <div
        className="relative aspect-square overflow-hidden bg-muted cursor-pointer"
        onClick={() => onViewDetail(id)}
      >
        <img
          src={image}
          alt={name}
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
        />
        {!imageLoaded && (
          <div className="absolute inset-0 bg-muted animate-pulse" />
        )}

        {/* Tag */}
        {tag && (
          <span
            className={`absolute top-3 left-3 text-[9px] tracking-[0.3em] uppercase px-2.5 py-1 font-semibold ${
              tagColor || "bg-primary text-primary-foreground"
            }`}
          >
            {tag}
          </span>
        )}

        {/* Like Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onLike(id);
          }}
          disabled={liking}
          className={`absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-background/80 backdrop-blur-sm border border-border transition-colors ${
            liked ? "text-rose-500" : "text-muted-foreground hover:text-rose-400"
          } ${liking ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <Heart size={14} fill={liked ? "currentColor" : "none"} />
        </button>

        {/* Discount Badge */}
        {originalPrice && discountPercent > 0 && (
          <span className="absolute bottom-3 left-3 bg-red-600 text-white text-[9px] tracking-wider uppercase px-2 py-0.5 font-semibold">
            -{discountPercent}%
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        <div>
          <p className="text-[9.5px] tracking-[0.3em] uppercase text-muted-foreground">
            {subtitle}
          </p>
          <h3
            className="text-[16px] leading-snug mt-0.5 cursor-pointer hover:text-primary transition-colors font-serif font-light"
            onClick={() => onViewDetail(id)}
          >
            {name}
          </h3>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <Star size={11} fill="currentColor" className="text-accent" />
          <span className="text-[12px] font-medium">{rating.toFixed(1)}</span>
          <span className="text-[11px] text-muted-foreground">({reviewCount})</span>
        </div>

        {/* Price & Add Button */}
        <div className="flex items-center gap-2 mt-auto pt-2 border-t border-border">
          <div className="flex-1">
            <span className="font-semibold text-[14px] text-foreground">
              {price.toLocaleString("vi-VN")}₫
            </span>
            {originalPrice && (
              <span className="text-[11px] text-muted-foreground line-through ml-1.5">
                {originalPrice.toLocaleString("vi-VN")}₫
              </span>
            )}
          </div>
          <button
            onClick={() => onAddToCart(id)}
            className="w-8 h-8 bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors flex-shrink-0 active:scale-95"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>
    </article>
  );
}
