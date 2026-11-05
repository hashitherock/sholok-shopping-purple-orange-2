import { Link } from "@tanstack/react-router";
import { Eye, GitCompareArrows, Heart, ShoppingCart } from "lucide-react";
import { discountPct, inStock, taka, type Product } from "@/data/catalog";
import { useShop } from "@/store/shop";
import { cn } from "@/lib/utils";
import { Stars } from "./bits";

export function ProductCard({ product, showStock = false }: { product: Product; showStock?: boolean }) {
  const { addToCart, toggleWishlist, wishlist, compare, toggleCompare, setQuickView } = useShop();
  const wished = wishlist.includes(product.id);
  const compared = compare.includes(product.id);
  const off = discountPct(product);
  const available = inStock(product);
  const soldPct = Math.min(100, Math.round((product.sold / (product.sold + product.stock)) * 100));

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lift">
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Link to="/product/$id" params={{ id: product.id }}>
          <img src={product.image} alt={product.name} loading="lazy" width={400} height={400}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
        </Link>
        {off > 0 && (
          <span className="absolute left-2 top-2 rounded-md bg-sale px-2 py-0.5 text-xs font-bold text-sale-foreground">-{off}%</span>
        )}
        {!available && (
          <span className="absolute left-2 top-9 rounded-md bg-foreground/80 px-2 py-0.5 text-xs font-bold text-background">Out of stock</span>
        )}
        <button onClick={() => toggleWishlist(product.id)} aria label={wished ? "Remove from wishlist" : "Add to wishlist"}
          className={cn("absolute right-2 top-2 grid h-9 w-9 place-items-center rounded-full bg-card shadow-card transition-all hover:scale-110", wished ? "text-sale" : "text-muted-foreground hover:text-sale")}>
          <Heart className={cn("h-4 w-4", wished && "animate-pop fill-sale")} />
        </button>
        <div className="absolute right-2 top-12 flex flex-col gap-2 transition-all duration-300 lg:translate-x-12 lg:opacity-0 lg:group-hover:translate-x-0 lg:group-hover:opacity-100">
          <button onClick={() => setQuickView(product)} aria-label="Quick view"
            className="grid h-9 w-9 place-items-center rounded-full bg-card text-muted-foreground shadow-card transition hover:bg-primary hover:text-primary-foreground">
            <Eye className="h-4 w-4" />
          </button>
          <button onClick={() => toggleCompare(product.id)} aria-label="Compare"
            className={cn("grid h-9 w-9 place-items-center rounded-full shadow-card transition hover:bg-primary hover:text-primary-foreground", compared ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground")}>
            <GitCompareArrows className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <Link to="/product/$id" params={{ id: product.id }} className="line-clamp-2 min-h-10 text-sm font-semibold leading-5 text-foreground transition-colors hover:text-primary">
          {product.name}
        </Link>
        <Stars rating={product.rating} reviews={product.reviews} size={12} />
        <div className="mt-auto flex flex-wrap items-baseline gap-x-2">
          <span className="font-display text-lg font-extrabold text-primary">{taka(product.price)}</span>
          <span className="text-xs text-muted-foreground line-through">{taka(product.oldPrice)}</span>
          {off > 0 && <span className="text-xs font-bold text-sale">{off}% off</span>}
        </div>
        {showStock && (
          <div>
            <div className="h-1.5 overflow-hidden rounded-full bg-sale-soft">
              <div className="h-full rounded-full bg-sale" style={{ width: `${soldPct}%` }} />
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">
              {available ? <>Only <b className="text-sale">{product.stock}</b> left · {product.sold} sold</> : "Sold out"}
            </p>
          </div>
        )}
        <button disabled={!available} onClick={() => addToCart(product.id)}
          className="btn-primary mt-1 w-full py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50">
          <ShoppingCart className="h-4 w-4" /> {available ? "Add to Cart" : "Unavailable"}
        </button>
      </div>
    </article>
  );
}

export function ProductGrid({ products, showStock }: { products: Product[]; showStock?: boolean }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
      {products.map((p) => <ProductCard key={p.id} product={p} showStock={showStock} />)}
    </div>
  );
}
