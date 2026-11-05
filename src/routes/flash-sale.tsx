import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Zap } from "lucide-react";
import { discountPct, flashProducts, flashSaleEnd } from "@/data/catalog";
import { Countdown } from "@/components/shop/bits";
import { ProductGrid } from "@/components/shop/ProductCard";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/flash-sale")({
  head: () => ({
    meta: [
      { title: "Flash Sale — Limited Time Deals | Sholok" },
      { name: "description", content: "Grab Sholok flash sale deals before the timer runs out." },
      { property: "og:title", content: "Flash Sale — Sholok" },
      { property: "og:description", content: "Limited time deals with big discounts." },
    ],
  }),
  component: FlashSalePage,
});

const filters = [{ label: "All deals", min: 0 }, { label: "20% +", min: 20 }, { label: "25% +", min: 25 }, { label: "30% +", min: 30 }];

function FlashSalePage() {
  const end = useMemo(() => flashSaleEnd(), []);
  const [min, setMin] = useState(0);
  const list = flashProducts.filter((p) => discountPct(p) >= min);
  return (
    <>
      <section className="bg-sale text-sale-foreground">
        <div className="container-x flex flex-col items-center gap-4 py-10 text-center">
          <h1 className="animate-fade-up flex items-center gap-3 text-4xl font-extrabold sm:text-5xl"><Zap className="h-10 w-10 fill-sale-foreground" /> Flash Sale</h1>
          <p className="opacity-90">Massive discounts for a limited time. Don't miss out!</p>
          <Countdown target={end} tone="light" />
        </div>
      </section>
      <div className="container-x py-8">
        <div className="mb-6 flex flex-wrap gap-2">
          {filters.map((f) => (
            <button key={f.label} onClick={() => setMin(f.min)}
              className={cn("rounded-full border px-4 py-2 text-sm font-semibold transition", min === f.min ? "border-sale bg-sale text-sale-foreground" : "border-border bg-card hover:border-sale hover:text-sale")}>
              {f.label}
            </button>
          ))}
        </div>
        {list.length ? <ProductGrid products={list} showStock /> : <p className="py-12 text-center text-muted-foreground">No deals match this discount.</p>}
      </div>
    </>
  );
}
