import { useState } from "react";
import { ArrowDown, ArrowRight, Sparkles } from "lucide-react";
import { Link, useLocation } from "wouter";
import Header from "@/components/Header";
import CartDrawer from "@/components/CartDrawer";
import { useCart } from "@/contexts/CartContext";
import { ABOUT_CTA_PATH, ABOUT_VALUES } from "./aboutContent";

export default function About() {
  const [, setLocation] = useLocation();
  const [cartOpen, setCartOpen] = useState(false);
  const { items, itemCount, updateQuantity, removeItem } = useCart();

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <Header
        cartCount={itemCount}
        onCartClick={() => setCartOpen(true)}
        onSearchChange={() => undefined}
        suggestions={[]}
      />

      {cartOpen && (
        <CartDrawer
          isOpen={cartOpen}
          items={items}
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
        <section className="relative isolate overflow-hidden border-b border-border bg-[#f4ecdf]">
          <div className="pointer-events-none absolute -right-8 -top-24 select-none font-serif text-[23rem] leading-none text-white/45 md:-right-4 md:text-[35rem]">
            B
          </div>
          <div className="pointer-events-none absolute -bottom-24 left-[12%] h-72 w-72 rounded-full bg-[#e9c78b]/35 blur-3xl" />

          <div className="container relative grid min-h-[590px] items-center gap-12 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
            <div className="max-w-2xl">
              <p className="mb-5 text-xs font-semibold tracking-[0.25em] text-accent">TỪ GIAN BẾP ĐẾN BÀN TIỆC</p>
              <h2 className="serif-title max-w-xl text-5xl leading-[0.98] md:text-7xl">
                Nghệ thuật được nướng bằng ký ức.
              </h2>
              <p className="mt-7 max-w-lg text-base leading-8 text-muted-foreground md:text-lg">
                Boulangerie là một lời mời chậm lại: để cảm nhận mùi bơ vừa tan, lớp vỏ giòn mỏng và niềm vui rất nhỏ của một chiếc bánh được làm thật kỹ.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <a href="#story" className="btn-primary inline-flex items-center gap-2">
                  Câu chuyện của chúng tôi <ArrowDown size={16} />
                </a>
                <Link href={ABOUT_CTA_PATH} className="inline-flex items-center gap-2 rounded border border-foreground px-5 py-3 text-sm font-medium transition-colors hover:bg-foreground hover:text-background">
                  Khám phá bộ sưu tập <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-md lg:ml-auto">
              <div className="absolute -left-5 -top-5 h-full w-full border border-foreground/20" />
              <div className="relative overflow-hidden bg-[#1f1a17] p-7 text-[#f8f2e8] shadow-2xl md:p-10">
                <p className="text-xs tracking-[0.28em] text-[#d8b478]">BOULANGERIE</p>
                <div className="my-12 border-y border-white/15 py-10 text-center">
                  <span className="serif-title text-8xl leading-none md:text-9xl">B</span>
                  <p className="mt-5 text-sm leading-7 text-white/70">
                    Những sáng tạo ngọt ngào dành cho mọi mùa trong năm.
                  </p>
                </div>
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.16em] text-white/60">
                  <span>Depuis 2026</span>
                  <Sparkles size={16} className="text-[#d8b478]" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="story" className="container grid gap-12 py-20 md:py-28 lg:grid-cols-[0.78fr_1.22fr] lg:gap-20">
          <div className="lg:sticky lg:top-48 lg:h-fit">
            <p className="text-xs font-semibold tracking-[0.25em] text-accent">CÂU CHUYỆN</p>
            <h2 className="serif-title mt-5 text-4xl leading-tight md:text-5xl">Bắt đầu từ một chiếc bánh rất giản dị.</h2>
          </div>
          <div className="max-w-2xl space-y-8 text-base leading-8 text-muted-foreground md:text-lg">
            <p>
              Chúng tôi tin rằng một món tráng miệng tinh tế không cần quá ồn ào. Nó bắt đầu bằng sự chỉn chu trong từng lựa chọn, từ chất bơ béo thơm đến trái cây đúng độ chín, rồi được hoàn thiện bằng sự kiên nhẫn của đôi tay người thợ.
            </p>
            <p>
              Mỗi bộ sưu tập của Boulangerie là một cuộc gặp gỡ giữa kỹ thuật pâtisserie cổ điển và cảm hứng đương đại. Entremet có chiều sâu, tart có độ tươi sáng, macaron có sự duyên dáng, còn những chiếc bánh theo mùa mang theo nhịp chuyển của thiên nhiên.
            </p>
            <blockquote className="border-l-2 border-accent pl-6 serif-subtitle text-2xl leading-relaxed text-foreground md:text-3xl">
              “Điều chúng tôi theo đuổi là một dư vị đủ dịu dàng để người ta muốn nhớ lại.”
            </blockquote>
          </div>
        </section>

        <section className="border-y border-border bg-muted/35">
          <div className="container py-20 md:py-24">
            <div className="mb-12 max-w-2xl">
              <p className="text-xs font-semibold tracking-[0.25em] text-accent">ĐIỀU CHÚNG TÔI GÌN GIỮ</p>
              <h2 className="serif-title mt-4 text-4xl md:text-5xl">Một trải nghiệm ngọt ngào, có chiều sâu.</h2>
            </div>
            <div className="grid gap-px overflow-hidden border border-border bg-border md:grid-cols-3">
              {ABOUT_VALUES.map(({ icon: Icon, title, description }) => (
                <article key={title} className="bg-background p-8 transition-transform duration-300 hover:-translate-y-1 md:p-10">
                  <Icon className="mb-10 h-6 w-6 text-accent" strokeWidth={1.5} />
                  <h3 className="serif-subtitle text-2xl">{title}</h3>
                  <p className="mt-4 text-sm leading-7 text-muted-foreground">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="container py-20 md:py-28">
          <div className="relative overflow-hidden bg-[#2a211c] px-7 py-16 text-[#fbf5eb] md:px-14 md:py-20">
            <div className="pointer-events-none absolute -bottom-32 -right-10 select-none font-serif text-[20rem] leading-none text-white/5">B</div>
            <div className="relative max-w-2xl">
              <p className="text-xs font-semibold tracking-[0.25em] text-[#d8b478]">DÀNH CHO KHOẢNH KHẮC CỦA BẠN</p>
              <h2 className="serif-title mt-5 text-4xl leading-tight md:text-6xl">Một lý do thật đẹp để cùng nhau thưởng thức.</h2>
              <p className="mt-6 max-w-xl leading-8 text-white/70">
                Ghé thăm bộ sưu tập bánh của chúng tôi để chọn một hương vị dành cho ngày thường, một buổi gặp gỡ, hay một dịp thật đặc biệt.
              </p>
              <Link href={ABOUT_CTA_PATH} className="mt-9 inline-flex items-center gap-2 border-b border-[#d8b478] pb-2 text-sm font-medium text-[#f2d3a1] transition-colors hover:text-white">
                Xem các bộ sưu tập <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-muted/30">
        <div className="container py-12">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <h3 className="serif-subtitle text-lg">Boulangerie</h3>
              <p className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground">Bánh ngọt cao cấp được chế biến từ những nguyên liệu tốt nhất.</p>
            </div>
            <div>
              <h4 className="font-semibold">Liên Kết</h4>
              <div className="mt-4 flex flex-col gap-2 text-sm text-muted-foreground">
                <Link href="/" className="transition-colors hover:text-foreground">Trang Chủ</Link>
                <Link href="/about" className="transition-colors hover:text-foreground">Về Chúng Tôi</Link>
                <Link href="/#products" className="transition-colors hover:text-foreground">Sản Phẩm</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold">Liên Hệ</h4>
              <p className="mt-4 text-sm text-muted-foreground">hello@boulangerie.com</p>
              <p className="mt-2 text-sm text-muted-foreground">+84 (0) 123 456 789</p>
            </div>
          </div>
          <div className="mt-10 border-t border-border pt-8 text-center text-sm text-muted-foreground">© 2026 Boulangerie. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
