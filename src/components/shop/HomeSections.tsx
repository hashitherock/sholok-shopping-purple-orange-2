import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ChevronLeft, ChevronRight, Flame, TrendingUp, Zap } from "lucide-react";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";
import promo1 from "@/assets/promo-1.jpg";
import promo2 from "@/assets/promo-2.jpg";
import promo3 from "@/assets/promo-3.jpg";
import promo4 from "@/assets/promo-4.jpg";
import veg from "@/assets/veg-banner.jpg";
import { categories, flashProducts, flashSaleEnd, products, trendingProducts } from "@/data/catalog";
import { recommend } from "@/lib/recommend";
import { useShop } from "@/store/shop";
import { cn } from "@/lib/utils";
import { Countdown, Reveal, SectionHeading } from "./bits";
import { ProductGrid } from "./ProductCard";
import { CATEGORY_COL_W } from "./Header";

export function CategorySidebar() {
  return (
    <aside className={cn("hidden shrink-0 overflow-hidden rounded-b-xl border border-t-0 border-border bg-card lg:block", CATEGORY_COL_W)}>
      <ul className="py-1">
        {categories.map((c) => (
          <li key={c.slug}>
            <Link to="/shop" search={{ cat: c.slug }}
              className="group flex items-center gap-3 px-4 py-[0.55rem] text-sm font-medium text-foreground transition-all hover:bg-primary-soft hover:text-primary">
              <span className="grid h-7 w-7 place-items-center rounded-md bg-primary-soft transition group-hover:bg-primary group-hover:text-primary-foreground">
                <c.icon className="h-4 w-4 text-primary group-hover:text-primary-foreground" />
              </span>
              <span className="flex-1">{c.name}</span>
              <ChevronRight className="h-4 w-4 -translate-x-1 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100" />
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export function MobileCategoryStrip() {
  return (
    <div className="flex gap-3 overflow-x-auto pb-1 lg:hidden">
      {categories.map((c) => (
        <Link key={c.slug} to="/shop" search={{ cat: c.slug }} className="flex w-20 shrink-0 flex-col items-center gap-1.5 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-2xl border border-border bg-card shadow-card"><c.icon className="h-6 w-6 text-primary" /></span>
          <span className="line-clamp-2 text-[11px] font-medium leading-tight">{c.name}</span>
        </Link>
      ))}
    </div>
  );
}

const slides = [
  { img: hero1, eyebrow: "New Season Collection", title: "Festive Fashion For Every You", text: "Discover kurtis, sarees and three-piece sets curated for celebration.", offer: "Up to 40% OFF", cat: "womens-clothing" },
  { img: hero2, eyebrow: "Beauty Week", title: "Glow Up With Top Beauty Picks", text: "Lipsticks, serums and fragrances from loved brands.", offer: "Flat 25% OFF", cat: "beauty-makeup" },
  { img: hero3, eyebrow: "Home Essentials", title: "Make Your Kitchen Beautiful", text: "Cookware, bowls and kitchen tools for everyday cooking.", offer: "Buy 2 Get 10% OFF", cat: "home-kitchen" },
];

export function HeroSlider() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setI((x) => (x + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, [paused]);
  const go = (d: number) => setI((x) => (x + d + slides.length) % slides.length);
  return (
    <section onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
      className="relative min-w-0 flex-1 overflow-hidden rounded-xl bg-primary-soft lg:mt-4" aria-roledescription="carousel">
      <div className="flex h-full transition-transform duration-700 ease-out" style={{ transform: `translateX(-${i * 100}%)` }}>
        {slides.map((s, idx) => (
          <div key={s.title} className="relative aspect-[16/10] w-full shrink-0 sm:aspect-[2/1] lg:aspect-auto lg:min-h-[460px]" aria-hidden={idx !== i}>
            <img src={s.img} alt={s.title} width={1600} height={800} loading={idx === 0 ? "eager" : "lazy"} className="absolute inset-0 h-full w-full object-cover object-right" />
            <div className="absolute inset-0 bg-gradient-to-r from-card/95 via-card/70 to-transparent" />
            <div className={cn("relative flex h-full max-w-[62%] flex-col justify-center gap-2 p-5 sm:gap-3 sm:p-10", idx === i && "[&>*]:animate-fade-up")}>
              <span className="w-fit rounded-full bg-sale px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-sale-foreground sm:text-xs">{s.offer}</span>
              <p className="text-xs font-semibold text-primary sm:text-sm">{s.eyebrow}</p>
              <h2 className="text-xl font-extrabold leading-tight text-foreground sm:text-4xl lg:text-5xl">{s.title}</h2>
              <p className="hidden max-w-md text-sm text-muted-foreground sm:block">{s.text}</p>
              <Link to="/shop" search={{ cat: s.cat }} className="btn-primary mt-1 w-fit text-sm" tabIndex={idx === i ? 0 : -1}>Shop Now <ArrowRight className="h-4 w-4" /></Link>
            </div>
          </div>
        ))}
      </div>
      <button onClick={() => go(-1)} aria-label="Previous slide" className="absolute left-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-card/90 shadow-card transition hover:bg-primary hover:text-primary-foreground sm:grid"><ChevronLeft className="h-5 w-5" /></button>
      <button onClick={() => go(1)} aria-label="Next slide" className="absolute right-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-card/90 shadow-card transition hover:bg-primary hover:text-primary-foreground sm:grid"><ChevronRight className="h-5 w-5" /></button>
      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
        {slides.map((s, idx) => (
          <button key={s.title} onClick={() => setI(idx)} aria-label={`Go to slide ${idx + 1}`}
            className={cn("h-2.5 rounded-full transition-all", idx === i ? "w-8 bg-primary" : "w-2.5 bg-primary/30")} />
        ))}
      </div>
    </section>
  );
}

const promos = [
  { img: promo1, title: "Men's Fashion", text: "Shirts, chinos & sneakers", offer: "Save 30%", cat: "mens-clothing" },
  { img: promo2, title: "Baby Care", text: "Gentle care for little ones", offer: "Up to 20% OFF", cat: "baby-care" },
  { img: promo3, title: "Health & Wellness", text: "Vitamins & fitness gear", offer: "From ৳290", cat: "health-wellness" },
  { img: promo4, title: "Pet Care", text: "Food & toys they love", offer: "Flat 15% OFF", cat: "pet-care" },
];

export function PromoBanners() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {promos.map((p, i) => (
        <Reveal key={p.title} delay={i * 80}>
          <Link to="/shop" search={{ cat: p.cat }} className="group relative block aspect-[16/9] overflow-hidden rounded-xl bg-muted">
            <img src={p.img} alt={p.title} loading="lazy" width={816} height={816} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary-deep/90 via-primary-deep/60 to-transparent" />
            <div className="relative flex h-full flex-col justify-center gap-1 p-5 text-primary-foreground">
              <span className="w-fit rounded bg-sale px-2 py-0.5 text-[11px] font-bold uppercase">{p.offer}</span>
              <h3 className="text-xl font-extrabold">{p.title}</h3>
              <p className="text-sm opacity-90">{p.text}</p>
              <span className="mt-2 inline-flex w-fit items-center gap-1 rounded-md bg-card px-3 py-1.5 text-xs font-bold text-primary transition group-hover:gap-2">Shop Now <ArrowRight className="h-3.5 w-3.5" /></span>
            </div>
          </Link>
        </Reveal>
      ))}
    </div>
  );
}

export function FlashSaleSection() {
  const end = useMemo(() => flashSaleEnd(), []);
  return (
    <Reveal>
      <section className="rounded-2xl border border-sale/20 bg-sale-soft p-4 sm:p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <h2 className="flex items-center gap-2 text-2xl font-extrabold text-sale"><Zap className="h-6 w-6 fill-sale" /> Flash Sale</h2>
            <div className="flex items-center gap-2 text-sm font-semibold"><span className="hidden sm:inline">Ends in</span><Countdown target={end} /></div>
          </div>
          <Link to="/flash-sale" className="btn-sale text-sm">View All <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <ProductGrid products={flashProducts.slice(0, 6)} showStock />
      </section>
    </Reveal>
  );
}

export function TrendingSection() {
  return (
    <Reveal>
      <section>
        <SectionHeading title={<span className="flex items-center gap-2"><TrendingUp className="h-6 w-6 text-primary" /> Trending Items</span>} subtitle="What shoppers love right now"
          action={<Link to="/trending" className="flex items-center gap-1 text-sm font-bold text-primary hover:gap-2 transition-all">See all <ArrowRight className="h-4 w-4" /></Link>} />
        <ProductGrid products={trendingProducts.slice(0, 12)} />
      </section>
    </Reveal>
  );
}

export function VegBanner() {
  return (
    <Reveal>
      <section className="relative overflow-hidden rounded-2xl bg-muted">
        <img src={veg} alt="Fresh summer vegetables" loading="lazy" width={1808} height={608} className="absolute inset-0 h-full w-full object-cover object-right" />
        <div className="absolute inset-0 bg-gradient-to-r from-card via-card/80 to-transparent sm:via-card/40" />
        <div className="relative flex min-h-[220px] max-w-xl flex-col justify-center gap-3 p-6 sm:min-h-[300px] sm:p-12">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-success">Fresh & Organic</p>
          <h2 className="text-3xl font-extrabold leading-none text-foreground sm:text-5xl">SUMMER<br /><span className="text-primary">VEGETABLE</span></h2>
          <p className="text-lg font-semibold">Save up to <span className="font-extrabold text-sale">5% OFF</span></p>
          <Link to="/shop" className="btn-primary w-fit">Shop Now <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>
    </Reveal>
  );
}

export function MoreToLove() {
  const { lastSearch, sessionSeed } = useShop();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const [limit, setLimit] = useState(18);
  const items = useMemo(() => recommend(products, mounted ? lastSearch : null, mounted ? sessionSeed : 1, limit), [lastSearch, sessionSeed, mounted, limit]);
  return (
    <Reveal>
      <section>
        <SectionHeading title={<span className="flex items-center gap-2"><Flame className="h-6 w-6 text-sale" /> More to love</span>}
          subtitle={mounted && lastSearch ? `Picked for you based on “${lastSearch}”` : "Handpicked products you might like"} />
        <ProductGrid products={items} />
        {limit < products.length && (
          <div className="mt-6 text-center"><button onClick={() => setLimit((l) => l + 12)} className="btn-outline">Load More</button></div>
        )}
      </section>
    </Reveal>
  );
}
