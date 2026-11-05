import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { productById, taka } from "@/data/catalog";
import { useShop } from "@/store/shop";
import { PageHero } from "@/components/shop/bits";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "My Wishlist — Sholok" },
      { name: "description", content: "Products you've saved on Sholok." },
      { property: "og:title", content: "My Wishlist — Sholok" },
      { property: "og:description", content: "Your saved Sholok products." },
    ],
  }),
  component: WishlistPage,
});

function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart } = useShop();
  const items = wishlist.map(productById).filter((p) => !!p);
  return (
    <>
      <PageHero title="My Wishlist" crumb="Wishlist" />
      <div className="container-x py-8">
        {items.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <Heart className="h-16 w-16 text-primary/30" />
            <p className="text-xl font-bold">Your wishlist is empty</p>
            <p className="text-muted-foreground">Tap the heart on any product to save it here.</p>
            <Link to="/shop" className="btn-primary mt-2">Explore products</Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((p) => (
              <div key={p.id} className="animate-fade-up flex gap-4 rounded-xl border border-border bg-card p-3 shadow-card">
                <Link to="/product/$id" params={{ id: p.id }}><img src={p.image} alt={p.name} className="h-24 w-24 rounded-lg object-cover" /></Link>
                <div className="flex flex-1 flex-col gap-1">
                  <Link to="/product/$id" params={{ id: p.id }} className="line-clamp-2 font-semibold hover:text-primary">{p.name}</Link>
                  <p className="font-bold text-primary">{taka(p.price)}</p>
                  <div className="mt-auto flex gap-2">
                    <button disabled={p.stock === 0} onClick={() => addToCart(p.id)} className="btn-primary flex-1 py-1.5 text-xs disabled:opacity-50"><ShoppingCart className="h-3.5 w-3.5" /> Add to Cart</button>
                    <button onClick={() => toggleWishlist(p.id)} aria-label="Remove from wishlist" className="grid h-8 w-8 place-items-center rounded-lg border border-border hover:border-sale hover:text-sale"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
