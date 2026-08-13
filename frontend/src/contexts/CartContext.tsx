import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import { PROMO_CODES, validatePromoCode } from "@/lib/promo";
import type { PromoResult } from "@/lib/promo";

export interface CartItem {
  productId: number;
  name: string;
  price: number;
  image: string;
  size: string;
  quantity: number;
}

type ApplyPromoResult = PromoResult;

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: number, size: string) => void;
  updateQuantity: (productId: number, size: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
  promoCode: string | null;
  discountAmount: number;
  applyPromoCode: (code: string) => ApplyPromoResult;
  removePromoCode: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [promoCode, setPromoCode] = useState<string | null>(null);

  const addItem = useCallback((item: CartItem) => {
    setItems((prev) => {
      const existing = prev.find(
        (i) => i.productId === item.productId && i.size === item.size
      );

      if (existing) {
        return prev.map((i) =>
          i.productId === item.productId && i.size === item.size
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }

      return [...prev, item];
    });
  }, []);

  const removeItem = useCallback((productId: number, size: string) => {
    setItems((prev) =>
      prev.filter((i) => !(i.productId === productId && i.size === size))
    );
  }, []);

  const updateQuantity = useCallback(
    (productId: number, size: string, quantity: number) => {
      if (quantity <= 0) {
        removeItem(productId, size);
        return;
      }

      setItems((prev) =>
        prev.map((i) =>
          i.productId === productId && i.size === size
            ? { ...i, quantity }
            : i
        )
      );
    },
    [removeItem]
  );

  const clearCart = useCallback(() => {
    setItems([]);
    setPromoCode(null);
  }, []);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  const activePromo = promoCode ? PROMO_CODES[promoCode] : undefined;
  const discountAmount = activePromo && (!activePromo.minSubtotal || subtotal >= activePromo.minSubtotal)
    ? Math.round((subtotal * activePromo.percentage) / 100)
    : 0;

  const applyPromoCode = useCallback(
    (rawCode: string): ApplyPromoResult => {
      const result = validatePromoCode(rawCode, subtotal);
      if (result.success && result.code) {
        setPromoCode(result.code);
      }
      return result;
    },
    [subtotal]
  );

  const removePromoCode = useCallback(() => {
    setPromoCode(null);
  }, []);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        total: subtotal,
        itemCount,
        promoCode,
        discountAmount,
        applyPromoCode,
        removePromoCode,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
