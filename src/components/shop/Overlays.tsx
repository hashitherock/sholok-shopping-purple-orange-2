import { Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, ShoppingCart, Trash2, X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { categoryBySlug, discountPct, productById, taka } from "@/data/catalog";
import { useShop } from "@/store/shop";
import { cn } from "@/lib/utils";
import { Stars } from "./bits";

export function QtyControl({ qty, onChange }: { qty: number; onChange: (n: number) => void }) {
  return (
    <div className="inline-flex items-center rounded-lg border border-border">
      <button onClick={() => onChange(qty - 1)} aria-label="Decrease" className="grid h-9 w-9 place-items-center transition hover:text-primary"><Minus className="h-4 w-4" /></button>
      <span className="w-8 text-center text-sm font-bold tabular-nums">{qty}</span>
      <button onClick={() => onChange(qty + 1)} aria-label="Increase" className="grid h-9 w-9 place-items-center transition hover:text-primary"><Plus className="h-4 w-4" /></button>
    </div>
  );
}

export function CartDrawer() {
  const { cartOpen, setCartOpen, cartItems, subtotal, setQty, removeFromCart, cartCount } = useShop();
  return (
    <div className={cn("fixed inset-0 z-[70]", cartOpen ? "pointer-events-auto" : "pointer-events-none")} aria-hidden={!cartOpen}>
      <div onClick={() => setCartOpen(false)} className={cn("absolute inset-0 bg-overlay transition-opacity duration-300", cartOpen ? "opacity-100" : "opacity-0")} />
      <aside role="dialog" aria-label="Shopping cart"
        className={cn("absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-card shadow-lift transition-transform duration-300", cartOpen ? "translate-x-0" : "translate-x-full")}>
        <div className="flex items-center justify-between border-b border-border p-4">
          <h2 className="text-lg font-extrabold">Your Cart <span className="text-muted-foreground">({cartCount})</span></h2>
          <button onClick={() => setCartOpen(false)} aria-label="Close cart" className="grid h-10 w-10 place-items-center rounded-full hover:bg-muted"><X className="h-5 w-5" /></button>
        </div>
        {cartItems.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
            <ShoppingBag className="h-14 w-14 text-primary/40" />
            <p className="font-bold">Your cart is empty</p>
            <button onClick={() => setCartOpen(false)} className="btn-primary text-sm">Start shopping</button>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-border overflow-y-auto px-4">
              {cartItems.map(({ product, qty }) => (
                <li key={product.id} className="animate-fade-up flex gap-3 py-4">
                  <img src={product.image} alt={product.name} className="h-20 w-20 rounded-lg object-cover" />
                  <div className="flex flex-1 flex-col gap-1">
                    <p className="line-clamp-2 text-sm font-semibold">{product.name}</p>
                    <p className="text-sm font-bold text-primary">{taka(product.price)}</p>
                    <div className="flex items-center justify-between">
                      <QtyControl qty={qty} onChange={(n) => setQty(product.id, n)} />
                      <button onClick={() => removeFromCart(product.id)} aria-label="Remove" className="text-muted-foreground transition hover:text-sale"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="space-y-3 border-t border-border p-4">
              <div className="flex justify-between text-base"><span>Subtotal</span><span className="font-extrabold text-primary">{taka(subtotal)}</span></div>
              <div className="grid grid-cols-2 gap-2">
                <Link to="/cart" onClick={() => setCartOpen(false)} className="btn-outline text-sm">View Cart</Link>
                <Link to="/cart" onClick={() => setCartOpen(false)} className="btn-sale text-sm">Checkout</Link>
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

export function QuickView() {
  const { quickView: p, setQuickView, addToCart } = useShop();
  return (
    <Dialog open={!!p} onOpenChange={(o) => !o && setQuickView(null)}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto p-0 sm:rounded-2xl">
        {p && (
          <div className="grid gap-0 md:grid-cols-2">
            <img src={p.image} alt={p.name} className="aspect-square w-full object-cover md:rounded-l-2xl" />
            <div className="flex flex-col gap-3 p-6">
              <p className="text-xs font-semibold uppercase text-primary">{categoryBySlug(p.category)?.name}</p>
              <DialogTitle className="text-2xl font-extrabold">{p.name}</DialogTitle>
              <Stars rating={p.rating} reviews={p.reviews} />
              <div className="flex items-baseline gap-2">
                <span className="font-display text-2xl font-extrabold text-primary">{taka(p.price)}</span>
                <span className="text-muted-foreground line-through">{taka(p.oldPrice)}</span>
                <span className="rounded bg-sale px-1.5 text-xs font-bold text-sale-foreground">-{discountPct(p)}%</span>
              </div>
              <DialogDescription className="text-sm leading-6 text-muted-foreground">{p.description}</DialogDescription>
              <div className="mt-auto flex flex-wrap gap-2">
                <button disabled={p.stock === 0} onClick={() => { addToCart(p.id); setQuickView(null); }} className="btn-primary flex-1 disabled:opacity-50"><ShoppingCart className="h-4 w-4" /> Add to Cart</button>
                <Link to="/product/$id" params={{ id: p.id }} onClick={() => setQuickView(null)} className="btn-outline">Details</Link>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function CompareModal() {
  const { compareOpen, setCompareOpen, compare, toggleCompare, addToCart } = useShop();
  const items = compare.map(productById).filter((x) => !!x);
  const rows: [string, (p: NonNullable<(typeof items)[number]>) => React.ReactNode][] = [
    ["Price", (p) => <b className="text-primary">{taka(p.price)}</b>],
    ["Regular", (p) => <span className="line-through">{taka(p.oldPrice)}</span>],
    ["Discount", (p) => <span className="font-bold text-sale">{discountPct(p)}%</span>],
    ["Rating", (p) => <Stars rating={p.rating} reviews={p.reviews} size={12} />],
    ["Category", (p) => categoryBySlug(p.category)?.name],
    ["Stock", (p) => (p.stock > 0 ? <span className="text-success">In stock ({p.stock})</span> : <span className="text-sale">Out of stock</span>)],
  ];
  return (
    <Dialog open={compareOpen} onOpenChange={setCompareOpen}>
      <DialogContent className="max-h-[90vh] max-w-5xl overflow-y-auto sm:rounded-2xl">
        <DialogTitle className="text-xl font-extrabold">Compare Products ({items.length})</DialogTitle>
        <DialogDescription className="sr-only">Side by side product comparison</DialogDescription>
        {items.length === 0 ? (
          <p className="py-10 text-center text-muted-foreground">No products to compare yet. Tap the compare icon on any product.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr>
                  <th className="w-28" />
                  {items.map((p) => (
                    <th key={p.id} className="p-2 align-top font-normal">
                      <div className="relative">
                        <button onClick={() => toggleCompare(p.id)} aria-label="Remove" className="absolute right-1 top-1 grid h-7 w-7 place-items-center rounded-full bg-card shadow-card hover:text-sale"><X className="h-4 w-4" /></button>
                        <img src={p.image} alt={p.name} className="aspect-square w-full rounded-lg object-cover" />
                        <p className="mt-2 line-clamp-2 text-left font-semibold">{p.name}</p>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map(([label, render]) => (
                  <tr key={label} className="border-t border-border">
                    <td className="p-2 font-semibold text-muted-foreground">{label}</td>
                    {items.map((p) => <td key={p.id} className="p-2">{render(p)}</td>)}
                  </tr>
                ))}
                <tr className="border-t border-border">
                  <td />
                  {items.map((p) => (
                    <td key={p.id} className="p-2"><button disabled={p.stock === 0} onClick={() => addToCart(p.id)} className="btn-primary w-full py-2 text-xs disabled:opacity-50">Add to Cart</button></td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
