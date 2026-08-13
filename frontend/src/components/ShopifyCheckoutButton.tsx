import { CreditCard, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/services/trpc";
import { buildShopifyCheckoutLines, type CheckoutLineSource } from "@/lib/shopifyCheckout";
import { Button } from "@/components/ui/button";

type ShopifyCheckoutButtonProps = {
  items: CheckoutLineSource[];
};

export default function ShopifyCheckoutButton({ items }: ShopifyCheckoutButtonProps) {
  const createCart = trpc.commerce.cart.create.useMutation();
  const checkout = buildShopifyCheckoutLines(items);
  const canCheckout = checkout.lines.length > 0 && checkout.unsupportedProductIds.length === 0;

  const proceedToShopify = async () => {
    if (!canCheckout) {
      toast.message("Giỏ hàng chưa thể thanh toán trực tuyến", {
        description: "Một sản phẩm trong giỏ chưa được đồng bộ. Vui lòng làm mới catalogue rồi thử lại.",
      });
      return;
    }

    try {
      const cart = await createCart.mutateAsync({ lines: checkout.lines });
      window.location.assign(cart.checkoutUrl);
    } catch (error) {
      toast.error("Chưa thể mở thanh toán Shopify", {
        description: error instanceof Error ? error.message : "Vui lòng thử lại sau ít phút.",
      });
    }
  };

  return (
    <div className="mt-6 border border-gold/40 bg-[#f4eadb] p-4 text-primary">
      <div className="flex gap-3">
        <div className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-full bg-primary text-gold">
          <ShieldCheck size={17} />
        </div>
        <div>
          <p className="text-[10px] font-semibold tracking-[0.16em] text-terracotta">THANH TOÁN BẢO MẬT</p>
          <h3 className="mt-1 font-serif text-xl">Thanh toán trực tuyến qua Shopify</h3>
          <p className="mt-1 text-xs leading-5 text-primary/70">
            Bạn sẽ được chuyển đến trang thanh toán được Shopify bảo mật để hoàn tất đơn hàng.
          </p>
        </div>
      </div>
      {!canCheckout && (
        <p className="mt-4 border-t border-primary/15 pt-3 text-xs leading-5 text-primary/65">
          Một hoặc nhiều sản phẩm chưa sẵn sàng cho checkout. Vui lòng làm mới catalogue rồi thử lại.
        </p>
      )}
      <Button
        type="button"
        onClick={() => void proceedToShopify()}
        disabled={!canCheckout || createCart.isPending}
        className="mt-4 w-full bg-primary text-primary-foreground hover:bg-primary/90"
      >
        {createCart.isPending ? <Loader2 className="mr-2 size-4 animate-spin" /> : <CreditCard className="mr-2 size-4" />}
        {createCart.isPending ? "Đang mở Shopify…" : "Thanh toán với Shopify"}
      </Button>
    </div>
  );
}
