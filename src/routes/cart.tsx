import { createFileRoute, Link } from "@tanstack/react-router";
import { ShoppingBag, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { taka } from "@/data/catalog";
import { useShop } from "@/store/shop";
import { PageHero } from "@/components/shop/bits";
import { QtyControl } from "@/components/shop/Overlays";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Shopping Cart — Sholok" },
      { name: "description", content: "Review the items in your Sholok cart." },
      { property: "og:title", content: "Shopping Cart — Sholok" },
      { property: "og:description", content: "Your Sholok shopping cart." },
    ],
  }),
  component: CartPage,
});

const FREE_SHIP = 1500;
const SHIPPING = 60;

function CartPage() {
  const { cartItems, subtotal, setQty, removeFromCart } = useShop();
  const shipping = subtotal === 0 || subtotal >= FREE_SHIP ? 0 : SHIPPING;
  return (
    <>
      <PageHero title="Shopping Cart" crumb="Cart" />
      <div className="container-x py-8">
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <ShoppingBag className="h-16 w-16 text-primary/30" />
            <p className="text-xl font-bold">Your cart is empty</p>
            <Link to="/shop" className="btn-primary mt-2">Continue Shopping</Link>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            <div className="overflow-hidden rounded-xl border border-border bg-card">
              {cartItems.map(({ product: p, qty }) => (
                <div key={p.id} className="flex flex-wrap items-center gap-4 border-b border-border p-4 last:border-0">
                  <img src={p.image} alt={p.name} className="h-20 w-20 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1">
                    <Link to="/product/$id" params={{ id: p.id }} className="font-semibold hover:text-primary">{p.name}</Link>
                    <p className="text-sm text-muted-foreground">{taka(p.price)} each</p>
                  </div>
                  <QtyControl qty={qty} onChange={(n) => setQty(p.id, n)} />
                  <p className="w-28 text-right font-extrabold text-primary">{taka(p.price * qty)}</p>
                  <button onClick={() => removeFromCart(p.id)} aria-label="Remove" className="text-muted-foreground hover:text-sale"><Trash2 className="h-5 w-5" /></button>
                </div>
              ))}
            </div>
            <aside className="h-fit space-y-3 rounded-xl border border-border bg-card p-5 shadow-card lg:sticky lg:top-16">
              <h2 className="text-lg font-extrabold">Order Summary</h2>
              <div className="flex justify-between text-sm"><span>Subtotal</span><span className="font-semibold">{taka(subtotal)}</span></div>
              <div className="flex justify-between text-sm"><span>Shipping (estimated)</span><span className="font-semibold">{shipping ? taka(shipping) : "Free"}</span></div>
              {shipping > 0 && <p className="text-xs text-muted-foreground">Add {taka(FREE_SHIP - subtotal)} more for free delivery.</p>}
              <div className="flex justify-between border-t border-border pt-3 text-lg"><span className="font-bold">Estimated total</span><span className="font-extrabold text-primary">{taka(subtotal + shipping)}</span></div>
              <button onClick={() => toast("Checkout is a preview in this demo")} className="btn-sale w-full">Proceed to Checkout</button>
              <Link to="/shop" className="btn-outline w-full">Continue Shopping</Link>
            </aside>
          </div>
        )}
      </div>
    </>
  );
}
