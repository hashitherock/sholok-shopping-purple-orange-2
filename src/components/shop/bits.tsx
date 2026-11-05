import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link to="/" className={cn("font-logo text-3xl leading-none tracking-tight text-primary", className)} aria-label="Sholok home">
      SHOLOK
    </Link>
  );
}

export function Stars({ rating, reviews, size = 14 }: { rating: number; reviews?: number; size?: number }) {
  return (
    <div className="flex items-center gap-1 text-xs text-muted-foreground">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star key={i} width={size} height={size} className={i <= Math.round(rating) ? "fill-star text-star" : "text-border"} />
        ))}
      </div>
      <span className="font-semibold text-foreground">{rating.toFixed(1)}</span>
      {reviews !== undefined && <span>({reviews})</span>}
    </div>
  );
}

export function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); io.disconnect(); } }, { threshold: 0.08 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={cn("reveal", visible && "is-visible", className)} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

export function SectionHeading({ title, subtitle, action }: { title: ReactNode; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3 border-b border-border pb-3">
      <div>
        <h2 className="text-xl font-extrabold text-foreground sm:text-2xl">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function useCountdown(target: number) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const diff = now === null ? 0 : Math.max(0, target - now);
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff / 3600000) % 24),
    minutes: Math.floor((diff / 60000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    ready: now !== null,
  };
}

export function Countdown({ target, tone = "sale" }: { target: number; tone?: "sale" | "light" }) {
  const t = useCountdown(target);
  const parts: [string, number][] = [["Days", t.days], ["Hrs", t.hours], ["Min", t.minutes], ["Sec", t.seconds]];
  return (
    <div className="flex items-center gap-1.5" aria-label="Time left in sale">
      {parts.map(([label, v], i) => (
        <div key={label} className="flex items-center gap-1.5">
          <div className={cn("min-w-11 rounded-md px-1.5 py-1 text-center", tone === "sale" ? "bg-sale text-sale-foreground" : "bg-card text-sale")}>
            <div className="font-display text-lg font-extrabold leading-none tabular-nums">{t.ready ? String(v).padStart(2, "0") : "--"}</div>
            <div className="text-[10px] font-semibold uppercase opacity-90">{label}</div>
          </div>
          {i < 3 && <span className="font-bold text-sale">:</span>}
        </div>
      ))}
    </div>
  );
}

export function Breadcrumb({ items }: { items: { label: string; to?: string }[] }) {
  return (
    <nav className="text-sm text-muted-foreground" aria-label="Breadcrumb">
      <Link to="/" className="hover:text-primary">Home</Link>
      {items.map((it) => (
        <span key={it.label}>
          <span className="mx-2">/</span>
          {it.to ? <a href={it.to} className="hover:text-primary">{it.label}</a> : <span className="text-foreground">{it.label}</span>}
        </span>
      ))}
    </nav>
  );
}

export function PageHero({ title, crumb, children }: { title: string; crumb: string; children?: ReactNode }) {
  return (
    <div className="bg-primary-soft">
      <div className="container-x flex flex-col gap-2 py-8 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="animate-fade-up text-2xl font-extrabold text-primary sm:text-3xl">{title}</h1>
        <Breadcrumb items={[{ label: crumb }]} />
      </div>
      {children}
    </div>
  );
}
