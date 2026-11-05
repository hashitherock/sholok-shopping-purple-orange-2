import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Heart, ShieldCheck, ShoppingCart, Truck } from "lucide-react";
import { categoryBySlug, discountPct, productById, products, taka } from "@/data/catalog";
import { useShop } from "@/store/shop";
import { Breadcrumb, SectionHeading, Stars } from "@/components/shop/bits";
import { ProductGrid } from "@/components/shop/ProductCard";
import { QtyControl } from "@/components/shop/Overlays";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/product/$id")({
  loader: ({ params }) => {
    const product = productById(params.id);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.product.name} — Sholok` },
          { name: "description", content: loaderData.product.description },
          { property: "og:title", content: `${loaderData.product.name} — Sholok` },
          { property: "og:description", content: loaderData.product.description },
        ]
      : [{ title: "Product unavailable — Sholok" }, { name: "robots", content: "noindex" }],
  }),
  notFoundComponent: () => (
    <div className="container-x py-20 text-center"><p className="text-xl font-bold">Product not found</p><Link to="/shop" className="btn-primary mt-4">Back to shop</Link></div>
  ),
  component: ProductPage,
});

function ProductPage() {
  const { product: p } = Route.useLoaderData();
  const { addToCart, toggleWishlist, wishlist } = useShop();
  const [qty, setQty] = useState(1);
  const [active, setActive] = useState(0);
  const gallery = [p.image, p.image, p.image];
  const cat = categoryBySlug(p.category);
  const related = products.filter((x) => x.category === p.category && x.id !== p.id).concat(products.filter((x) => cat?.related.includes(x.category))).slice(0, 6);
  const wished = wishlist.includes(p.id);

  return (
    <div className="container-x py-6">
      <Breadcrumb items={[{ label: cat?.name ?? "Shop", to: `/shop?cat=${p.category}` }, { label: p.name }]} />
      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <div className="animate-fade-up">
          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            <img src={gallery[active]} alt={p.name} className={cn("aspect-square w-full object-cover transition-transform duration-500", active === 1 && "scale-125", active === 2 && "scale-150 object-top")} />
          </div>
          <div className="mt-3 flex gap-3">
            {gallery.map((g, i) => (
              <button key={i} onClick={() => setActive(i)} aria-label={`Image ${i + 1}`} className={cn("h-20 w-20 overflow-hidden rounded-lg border-2 transition", active === i ? "border-primary" : "border-border")}>
                <img src={g} alt="" className={cn("h-full w-full object-cover", i === 1 && "scale-125", i === 2 && "scale-150 object-top")} />
              </button>
            ))}
          </div>
        </div>
        <div className="animate-fade-up space-y-4">
          <p className="text-sm font-semibold uppercase text-primary">{cat?.name}</p>
          <h1 className="text-3xl font-extrabold leading-tight">{p.name}</h1>
          <Stars rating={p.rating} reviews={p.reviews} />
          <div className="flex flex-wrap items-baseline gap-3">
            <span className="font-display text-3xl font-extrabold text-primary">{taka(p.price)}</span>
            <span className="text-lg text-muted-foreground line-through">{taka(p.oldPrice)}</span>
            <span className="rounded-md bg-sale px-2 py-0.5 text-sm font-bold text-sale-foreground">-{discountPct(p)}%</span>
          </div>
          <p className={cn("text-sm font-semibold", p.stock > 0 ? "text-success" : "text-sale")}>{p.stock > 0 ? `In stock · ${p.stock} available` : "Out of stock"}</p>
          <p className="leading-7 text-muted-foreground">{p.description}</p>
          <div className="flex flex-wrap items-center gap-3">
            <QtyControl qty={qty} onChange={(n) => setQty(Math.max(1, n))} />
            <button disabled={p.stock === 0} onClick={() => addToCart(p.id, qty)} className="btn-primary flex-1 disabled:opacity-50"><ShoppingCart className="h-4 w-4" /> Add to Cart</button>
            <button onClick={() => toggleWishlist(p.id)} aria-label="Wishlist" className={cn("grid h-11 w-11 place-items-center rounded-lg border transition", wished ? "border-sale text-sale" : "border-border hover:text-sale")}>
              <Heart className={cn("h-5 w-5", wished && "fill-sale")} />
            </button>
          </div>
          <div className="grid gap-3 rounded-xl bg-primary-soft p-4 text-sm sm:grid-cols-2">
            <p className="flex items-center gap-2"><Truck className="h-5 w-5 text-primary" /> Delivery in 1–3 days</p>
            <p className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-primary" /> 100% genuine product</p>
          </div>
        </div>
      </div>
      <section className="mt-14">
        <SectionHeading title="Related Products" />
        <ProductGrid products={related} />
      </section>
    </div>
  );
}
