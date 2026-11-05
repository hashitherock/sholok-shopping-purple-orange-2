import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SlidersHorizontal, X } from "lucide-react";
import { categories, categoryBySlug, discountPct, products } from "@/data/catalog";
import { searchProducts } from "@/lib/recommend";
import { useShop } from "@/store/shop";
import { PageHero } from "@/components/shop/bits";
import { ProductGrid } from "@/components/shop/ProductCard";
import { cn } from "@/lib/utils";

type ShopSearch = { q?: string; cat?: string; sort?: string };

export const Route = createFileRoute("/shop")({
  validateSearch: (s: Record<string, unknown>): ShopSearch => ({
    q: typeof s.q === "string" ? s.q : undefined,
    cat: typeof s.cat === "string" ? s.cat : undefined,
    sort: typeof s.sort === "string" ? s.sort : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Shop All Products — Sholok" },
      { name: "description", content: "Browse every Sholok category with filters for price, category and sorting." },
      { property: "og:title", content: "Shop All Products — Sholok" },
      { property: "og:description", content: "Browse fashion, beauty, home and more at Sholok." },
    ],
  }),
  component: ShopPage,
});

const PAGE = 12;
const MAX = 5000;

function ShopPage() {
  const { q, cat, sort = "popular" } = Route.useSearch();
  const navigate = useNavigate({ from: "/shop" });
  const { recordSearch } = useShop();
  const [maxPrice, setMaxPrice] = useState(MAX);
  const [visible, setVisible] = useState(PAGE);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => { if (q) recordSearch(q); }, [q, recordSearch]);
  useEffect(() => setVisible(PAGE), [q, cat, sort, maxPrice]);

  const list = useMemo(() => {
    let l = q ? searchProducts(products, q) : [...products];
    if (cat) l = l.filter((p) => p.category === cat);
    l = l.filter((p) => p.price <= maxPrice);
    if (sort === "price-asc") l.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") l.sort((a, b) => b.price - a.price);
    else if (sort === "discount") l.sort((a, b) => discountPct(b) - discountPct(a));
    else if (sort === "rating") l.sort((a, b) => b.rating - a.rating);
    else if (!q) l.sort((a, b) => b.popularity - a.popularity);
    return l;
  }, [q, cat, sort, maxPrice]);

  const title = cat ? categoryBySlug(cat)?.name ?? "Shop" : q ? `Results for “${q}”` : "Shop";

  const Filters = (
    <div className="space-y-6">
      <div>
        <h3 className="mb-2 font-bold">Categories</h3>
        <ul className="space-y-0.5">
          <li><Link to="/shop" search={{ q, sort }} className={cn("block rounded-md px-2 py-1.5 text-sm hover:bg-primary-soft", !cat && "bg-primary-soft font-bold text-primary")}>All Categories</Link></li>
          {categories.map((c) => (
            <li key={c.slug}>
              <Link to="/shop" search={{ q, sort, cat: c.slug }} onClick={() => setFiltersOpen(false)}
                className={cn("flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-primary-soft", cat === c.slug && "bg-primary-soft font-bold text-primary")}>
                <c.icon className="h-4 w-4 text-primary" /> {c.name}
                <span className="ml-auto text-xs text-muted-foreground">{products.filter((p) => p.category === c.slug).length}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="mb-2 font-bold">Max price: <span className="text-primary">৳{maxPrice.toLocaleString()}</span></h3>
        <input type="range" min={200} max={MAX} step={100} value={maxPrice} onChange={(e) => setMaxPrice(+e.target.value)} className="w-full accent-primary" aria-label="Maximum price" />
        <div className="flex justify-between text-xs text-muted-foreground"><span>৳200</span><span>৳{MAX.toLocaleString()}</span></div>
      </div>
    </div>
  );

  return (
    <>
      <PageHero title={title} crumb="Shop" />
      <div className="container-x flex gap-6 py-8">
        <aside className="hidden w-64 shrink-0 lg:block">{Filters}</aside>
        <div className="min-w-0 flex-1">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">Showing <b className="text-foreground">{Math.min(visible, list.length)}</b> of {list.length} products</p>
            <div className="flex items-center gap-2">
              <button onClick={() => setFiltersOpen(true)} className="btn-outline py-2 text-sm lg:hidden"><SlidersHorizontal className="h-4 w-4" /> Filters</button>
              <select value={sort} onChange={(e) => navigate({ search: (s) => ({ ...s, sort: e.target.value }) })} className="field w-auto py-2 text-sm" aria-label="Sort products">
                <option value="popular">Most popular</option>
                <option value="price-asc">Price: low to high</option>
                <option value="price-desc">Price: high to low</option>
                <option value="discount">Biggest discount</option>
                <option value="rating">Top rated</option>
              </select>
            </div>
          </div>
          {list.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-12 text-center">
              <p className="font-bold">No products found</p>
              <Link to="/shop" className="btn-primary mt-4 text-sm">Clear filters</Link>
            </div>
          ) : (
            <ProductGrid withSidebar products={list.slice(0, visible)} />
          )}
          {visible < list.length && <div className="mt-8 text-center"><button onClick={() => setVisible((v) => v + PAGE)} className="btn-outline">Load More</button></div>}
        </div>
      </div>
      {filtersOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-overlay" onClick={() => setFiltersOpen(false)} />
          <div className="animate-in slide-in-from-left absolute left-0 top-0 h-full w-[85%] max-w-sm overflow-y-auto bg-card p-5">
            <div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-extrabold">Filters</h2><button onClick={() => setFiltersOpen(false)} aria-label="Close filters"><X className="h-5 w-5" /></button></div>
            {Filters}
          </div>
        </div>
      )}
    </>
  );
}
