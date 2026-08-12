import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Loader2, Quote, ShieldCheck, Star } from "lucide-react";
import { trpc } from "@/lib/trpc";

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toLocaleUpperCase("vi-VN");
}

function reviewDate(value: Date | string | null) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toLocaleDateString("vi-VN", { month: "long", year: "numeric" });
}

export default function CustomerReviewsCarousel() {
  const { data: reviews = [], isLoading, isError, refetch } = trpc.reviews.listFeatured.useQuery({ limit: 6 });
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reviewCount = reviews.length;

  useEffect(() => {
    if (reviewCount < 2 || paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setActiveIndex((index) => (index + 1) % reviewCount), 6800);
    return () => window.clearInterval(timer);
  }, [paused, reviewCount]);

  useEffect(() => {
    if (activeIndex >= reviewCount && reviewCount > 0) setActiveIndex(0);
  }, [activeIndex, reviewCount]);

  if (isLoading) {
    return (
      <section className="border-y border-border bg-[#ead9c5] py-16 md:py-24" aria-label="Đánh giá khách hàng">
        <div className="container flex justify-center"><Loader2 className="h-7 w-7 animate-spin text-terracotta" /></div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="border-y border-border bg-[#ead9c5] py-16 md:py-24" aria-label="Đánh giá khách hàng">
        <div className="container grid gap-8 lg:grid-cols-[.72fr_1.28fr] lg:items-end">
          <div>
            <p className="section-eyebrow text-terracotta">Paroles de clients</p>
            <h2 className="mt-4 max-w-md font-serif text-5xl leading-[0.9] tracking-[-0.05em] md:text-6xl">Những cảm nhận<br /><em>đang được viết.</em></h2>
          </div>
          <div className="border border-dashed border-foreground/25 bg-card/60 p-7 md:p-9">
            <p className="font-serif text-3xl leading-tight">Chưa thể tải phần cảm nhận vào lúc này.</p>
            <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground">Bạn vẫn có thể tiếp tục khám phá các sáng tạo của Boulangerie.</p>
            <button type="button" onClick={() => void refetch()} className="mt-6 border border-primary bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-transparent hover:text-primary">Thử lại</button>
          </div>
        </div>
      </section>
    );
  }

  if (reviewCount === 0) {
    return (
      <section className="border-y border-border bg-[#ead9c5] py-16 md:py-24" aria-label="Đánh giá khách hàng">
        <div className="container grid gap-8 lg:grid-cols-[.72fr_1.28fr] lg:items-end">
          <div>
            <p className="section-eyebrow text-terracotta">Paroles de clients</p>
            <h2 className="mt-4 max-w-md font-serif text-5xl leading-[0.9] tracking-[-0.05em] md:text-6xl">Những cảm nhận<br /><em>đang được viết.</em></h2>
          </div>
          <div className="border border-dashed border-foreground/25 bg-card/60 p-7 md:p-9">
            <ShieldCheck className="h-6 w-6 text-terracotta" />
            <p className="mt-5 font-serif text-3xl leading-tight">Chúng tôi chỉ hiển thị đánh giá từ đơn hàng đã giao.</p>
            <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground">Mỗi lời chia sẻ sẽ được đội ngũ Boulangerie xem xét trước khi xuất hiện tại đây.</p>
          </div>
        </div>
      </section>
    );
  }

  const activeReview = reviews[activeIndex];
  const stars = Array.from({ length: 5 }, (_, index) => index < activeReview.rating);

  const previous = () => setActiveIndex((index) => (index - 1 + reviewCount) % reviewCount);
  const next = () => setActiveIndex((index) => (index + 1) % reviewCount);

  return (
    <section className="overflow-hidden border-y border-border bg-[#ead9c5] py-16 md:py-24" aria-label="Đánh giá khách hàng">
      <div className="container">
        <div className="mb-10 flex flex-col gap-5 md:mb-14 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="section-eyebrow text-terracotta">Paroles de clients</p>
            <h2 className="mt-4 font-serif text-5xl leading-[0.9] tracking-[-0.05em] md:text-6xl">Những chiếc bánh<br /><em>được nhớ lại.</em></h2>
          </div>
          <div className="max-w-sm text-sm leading-7 text-muted-foreground">Những cảm nhận được gửi bởi khách hàng đã nhận bánh và đã qua kiểm duyệt nội dung.</div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[.72fr_1.28fr] lg:gap-10" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
          <div className="flex min-h-52 flex-col justify-between bg-primary p-7 text-primary-foreground md:p-9">
            <Quote className="h-10 w-10 text-gold" strokeWidth={1.25} />
            <div>
              <p className="font-serif text-3xl leading-none">{String(activeIndex + 1).padStart(2, "0")} <span className="text-primary-foreground/35">/ {String(reviewCount).padStart(2, "0")}</span></p>
              <div className="mt-6 flex gap-2">
                <button type="button" onClick={previous} aria-label="Đánh giá trước" className="inline-flex h-10 w-10 items-center justify-center border border-primary-foreground/30 transition-colors hover:border-gold hover:text-gold"><ChevronLeft size={18} /></button>
                <button type="button" onClick={next} aria-label="Đánh giá tiếp theo" className="inline-flex h-10 w-10 items-center justify-center border border-primary-foreground/30 transition-colors hover:border-gold hover:text-gold"><ChevronRight size={18} /></button>
              </div>
            </div>
          </div>

          <article className="min-h-52 bg-card p-7 md:p-9" aria-live="polite">
            <div className="flex items-start justify-between gap-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-terracotta font-serif text-sm text-white">{initials(activeReview.authorName)}</div>
                <div>
                  <p className="font-semibold text-foreground">{activeReview.authorName}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{reviewDate(activeReview.createdAt)}</p>
                </div>
              </div>
              <div className="flex gap-0.5" aria-label={`${activeReview.rating} trên 5 sao`}>
                {stars.map((filled, index) => <Star key={index} size={15} className={filled ? "fill-gold text-gold" : "text-foreground/20"} />)}
              </div>
            </div>

            <div className="mt-7">
              {activeReview.title && <h3 className="font-serif text-3xl leading-tight">{activeReview.title}</h3>}
              <blockquote className={`${activeReview.title ? "mt-3" : ""} max-w-3xl font-serif text-2xl leading-snug text-foreground/85 md:text-3xl`}>“{activeReview.content}”</blockquote>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-foreground/10 pt-5 text-xs">
              <span className="font-semibold uppercase tracking-[0.12em] text-terracotta">{activeReview.productName}</span>
              <span className="flex items-center gap-1.5 text-muted-foreground"><ShieldCheck size={14} className="text-terracotta" /> Đã xác minh mua hàng</span>
            </div>
          </article>
        </div>

        {reviewCount > 1 && <div className="mt-6 flex justify-center gap-2" aria-label="Chọn đánh giá">{reviews.map((review, index) => <button key={review.id} type="button" onClick={() => setActiveIndex(index)} aria-label={`Xem đánh giá ${index + 1}`} className={`h-1.5 transition-all ${activeIndex === index ? "w-8 bg-terracotta" : "w-3 bg-foreground/20 hover:bg-foreground/40"}`} />)}</div>}
      </div>
    </section>
  );
}
