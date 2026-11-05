import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ChevronDown, Heart, LayoutGrid, MapPin, Menu, Phone, Search, ShoppingCart, User, X, Truck, GitCompareArrows,
} from "lucide-react";
import { categories, deliveryLocations, PHONE, products, taka } from "@/data/catalog";
import { searchProducts } from "@/lib/recommend";
import { useShop } from "@/store/shop";
import { cn } from "@/lib/utils";
import { Logo } from "./bits";

function useClickOutside(onOut: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) onOut(); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [onOut]);
  return ref;
}

function TopBar() {
  return (
    <div className="border-b border-border bg-card text-xs text-muted-foreground">
      <div className="container-x flex h-9 items-center justify-between gap-4">
        <p className="hidden items-center gap-1.5 sm:flex"><Truck className="h-3.5 w-3.5 text-primary" /> Free delivery on orders over ৳1,500 · Welcome to Sholok</p>
        <p className="truncate font-medium text-sale sm:hidden">Free delivery over ৳1,500</p>
        <div className="flex items-center gap-4">
          <span className="hidden md:inline">English</span>
          <a href={`tel:${PHONE.replace(/[^+\d]/g, "")}`} className="flex items-center gap-1.5 font-bold text-primary">
            <Phone className="h-3.5 w-3.5" /> {PHONE}
          </a>
        </div>
      </div>
    </div>
  );
}

function DeliveryLocation() {
  const { location, setLocation } = useShop();
  const [open, setOpen] = useState(false);
  const ref = useClickOutside(() => setOpen(false));
  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen((o) => !o)} className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-left transition hover:border-primary">
        <MapPin className="h-5 w-5 text-primary" />
        <span className="leading-tight">
          <span className="block text-[11px] text-muted-foreground">Deliver to</span>
          <span className="block text-sm font-bold">{location}</span>
        </span>
        <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="animate-in fade-in slide-in-from-top-2 absolute left-0 top-full z-50 mt-2 w-56 rounded-xl border border-border bg-popover p-2 shadow-lift">
          <p className="px-2 pb-1 text-xs font-semibold text-muted-foreground">Choose your location</p>
          {deliveryLocations.map((l) => (
            <button key={l} onClick={() => { setLocation(l); setOpen(false); }}
              className={cn("block w-full rounded-md px-2 py-1.5 text-left text-sm transition hover:bg-primary-soft", l === location && "bg-primary-soft font-bold text-primary")}>
              {l}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function SearchBar({ className }: { className?: string }) {
  const navigate = useNavigate();
  const { recordSearch } = useShop();
  const [q, setQ] = useState("");
  const [focus, setFocus] = useState(false);
  const ref = useClickOutside(() => setFocus(false));
  const suggestions = q.trim().length > 1 ? searchProducts(products, q).slice(0, 6) : [];
  const submit = (query: string) => {
    if (!query.trim()) return;
    recordSearch(query);
    setFocus(false);
    navigate({ to: "/shop", search: { q: query.trim() } });
  };
  return (
    <div ref={ref} className={cn("relative", className)}>
      <form onSubmit={(e) => { e.preventDefault(); submit(q); }} className="flex overflow-hidden rounded-lg border-2 border-primary bg-card">
        <input value={q} onChange={(e) => setQ(e.target.value)} onFocus={() => setFocus(true)}
          placeholder="Search for products, brands and more…" aria-label="Search products"
          className="min-w-0 flex-1 bg-transparent px-4 py-2.5 text-sm outline-none" />
        <button type="submit" aria-label="Search" className="grid place-items-center bg-primary px-4 text-primary-foreground transition hover:bg-primary-deep">
          <Search className="h-5 w-5" />
        </button>
      </form>
      {focus && suggestions.length > 0 && (
        <div className="animate-in fade-in slide-in-from-top-1 absolute inset-x-0 top-full z-50 mt-1 overflow-hidden rounded-xl border border-border bg-popover shadow-lift">
          {suggestions.map((p) => (
            <Link key={p.id} to="/product/$id" params={{ id: p.id }} onClick={() => { recordSearch(q); setFocus(false); }}
              className="flex items-center gap-3 px-3 py-2 transition hover:bg-primary-soft">
              <img src={p.image} alt="" className="h-10 w-10 rounded-md object-cover" />
              <span className="flex-1 truncate text-sm">{p.name}</span>
              <span className="text-sm font-bold text-primary">{taka(p.price)}</span>
            </Link>
          ))}
          <button onClick={() => submit(q)} className="w-full border-t border-border px-3 py-2 text-left text-sm font-semibold text-primary hover:bg-primary-soft">
            See all results for “{q}”
          </button>
        </div>
      )}
    </div>
  );
}

function AccountMenu() {
  const [open, setOpen] = useState(false);
  const ref = useClickOutside(() => setOpen(false));
  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen((o) => !o)} className="flex items-center gap-2 transition hover:text-primary" aria-label="Account">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-primary-soft text-primary"><User className="h-5 w-5" /></span>
        <span className="hidden leading-tight xl:block">
          <span className="block text-[11px] text-muted-foreground">Login</span>
          <span className="block text-sm font-bold">My Account</span>
        </span>
      </button>
      {open && (
        <div className="animate-in fade-in slide-in-from-top-2 absolute right-0 top-full z-50 mt-2 w-64 rounded-xl border border-border bg-popover p-4 shadow-lift">
          <p className="font-bold">Welcome to Sholok</p>
          <p className="mb-3 text-xs text-muted-foreground">Accounts are a preview in this demo.</p>
          <button onClick={() => setOpen(false)} className="btn-primary w-full text-sm">Login</button>
          <button onClick={() => setOpen(false)} className="btn-outline mt-2 w-full text-sm">Create account</button>
          <div className="mt-3 space-y-1 border-t border-border pt-3 text-sm">
            <Link to="/wishlist" onClick={() => setOpen(false)} className="block rounded px-2 py-1 hover:bg-primary-soft">My Wishlist</Link>
            <Link to="/cart" onClick={() => setOpen(false)} className="block rounded px-2 py-1 hover:bg-primary-soft">My Cart</Link>
          </div>
        </div>
      )}
    </div>
  );
}

function HeaderActions() {
  const { wishlist, cartCount, subtotal, setCartOpen, compare, setCompareOpen } = useShop();
  return (
    <div className="flex items-center gap-3 sm:gap-5">
      <div className="hidden sm:block"><AccountMenu /></div>
      <button onClick={() => setCompareOpen(true)} className="relative hidden transition hover:text-primary md:block" aria-label="Compare products">
        <GitCompareArrows className="h-6 w-6" />
        {compare.length > 0 && <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-sale px-1 text-[10px] font-bold text-sale-foreground">{compare.length}</span>}
      </button>
      <Link to="/wishlist" className="flex items-center gap-2 transition hover:text-primary" aria-label="Wishlist">
        <span className="relative">
          <Heart className="h-6 w-6" />
          <span key={wishlist.length} className="animate-pop absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-sale px-1 text-[10px] font-bold text-sale-foreground">{wishlist.length}</span>
        </span>
        <span className="hidden leading-tight xl:block">
          <span className="block text-[11px] text-muted-foreground">{wishlist.length} Favorite</span>
          <span className="block text-sm font-bold">My Wishlist</span>
        </span>
      </Link>
      <button onClick={() => setCartOpen(true)} className="flex items-center gap-2 transition hover:text-primary" aria-label="Open cart">
        <span className="relative grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground">
          <ShoppingCart className="h-5 w-5" />
          <span key={cartCount} className="animate-pop absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-sale px-1 text-[10px] font-bold text-sale-foreground">{cartCount}</span>
        </span>
        <span className="hidden text-left leading-tight lg:block">
          <span className="block text-[11px] text-muted-foreground">Your Cart</span>
          <span className="block text-sm font-bold">{taka(subtotal)}</span>
        </span>
      </button>
    </div>
  );
}

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/flash-sale", label: "Flash Sale" },
  { to: "/trending", label: "Trending" },
  { to: "/contact", label: "Contact" },
  { to: "/become-a-seller", label: "Become a Seller" },
] as const;

export const CATEGORY_COL_W = "lg:w-[270px]";

function CategoryDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useClickOutside(() => setOpen(false));
  return (
    <div ref={ref} className={cn("relative hidden shrink-0 lg:block", CATEGORY_COL_W)}>
      <button onClick={() => setOpen((o) => !o)} className="flex h-12 w-full items-center gap-3 bg-primary-deep px-4 text-sm font-extrabold uppercase tracking-wide text-primary-foreground">
        <LayoutGrid className="h-5 w-5" /> Shop by Category
        <ChevronDown className={cn("ml-auto h-4 w-4 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="animate-in fade-in slide-in-from-top-2 absolute left-0 top-full z-50 w-full rounded-b-xl border border-border bg-popover py-1 shadow-lift">
          {categories.map((c) => (
            <Link key={c.slug} to="/shop" search={{ cat: c.slug }} onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-sm text-foreground transition hover:bg-primary-soft hover:pl-5 hover:text-primary">
              <c.icon className="h-4 w-4 text-primary" /> {c.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <div className={cn("fixed inset-0 z-[60] lg:hidden", open ? "pointer-events-auto" : "pointer-events-none")}>
      <div onClick={onClose} className={cn("absolute inset-0 bg-overlay transition-opacity", open ? "opacity-100" : "opacity-0")} />
      <aside className={cn("absolute left-0 top-0 h-full w-[85%] max-w-sm overflow-y-auto bg-card shadow-lift transition-transform duration-300", open ? "translate-x-0" : "-translate-x-full")}>
        <div className="flex items-center justify-between border-b border-border p-4">
          <Logo className="text-2xl" />
          <button onClick={onClose} aria-label="Close menu" className="grid h-10 w-10 place-items-center rounded-full hover:bg-muted"><X className="h-5 w-5" /></button>
        </div>
        <nav className="p-2">
          {navLinks.map((l) => (
            <Link key={l.to} to={l.to} onClick={onClose} activeOptions={{ exact: l.to === "/" }}
              className="block rounded-lg px-3 py-3 font-semibold transition hover:bg-primary-soft" activeProps={{ className: "bg-primary-soft text-primary" }}>
              {l.label}
            </Link>
          ))}
        </nav>
        <p className="px-5 pb-2 pt-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">Shop by category</p>
        <div className="px-2 pb-6">
          {categories.map((c) => (
            <Link key={c.slug} to="/shop" search={{ cat: c.slug }} onClick={onClose} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-primary-soft">
              <c.icon className="h-4 w-4 text-primary" /> {c.name}
            </Link>
          ))}
        </div>
      </aside>
    </div>
  );
}

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <header>
      <TopBar />
      <div className="bg-card">
        <div className="container-x flex items-center gap-3 py-4 lg:gap-6">
          <button onClick={() => setMobileOpen(true)} className="grid h-10 w-10 place-items-center rounded-lg border border-border lg:hidden" aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </button>
          <Logo />
          <div className="hidden lg:block"><DeliveryLocation /></div>
          <SearchBar className="hidden flex-1 md:block" />
          <div className="ml-auto md:ml-0"><HeaderActions /></div>
        </div>
        <div className="container-x pb-3 md:hidden"><SearchBar /></div>
      </div>
      <nav className="sticky top-0 z-40 bg-primary text-primary-foreground shadow-card">
        <div className="container-x flex items-center gap-6">
          <CategoryDropdown />
          <div className="flex h-12 flex-1 items-center gap-1 overflow-x-auto">
            {navLinks.map((l) => (
              <Link key={l.to} to={l.to} activeOptions={{ exact: l.to === "/" }}
                className="relative whitespace-nowrap px-3 py-3 text-sm font-semibold opacity-90 transition hover:opacity-100 after:absolute after:inset-x-3 after:bottom-1.5 after:h-0.5 after:origin-left after:scale-x-0 after:rounded after:bg-primary-foreground after:transition-transform hover:after:scale-x-100"
                activeProps={{ className: "opacity-100 after:scale-x-100" }}>
                {l.label === "Flash Sale" ? <span className="flex items-center gap-1">{l.label}<span className="rounded bg-sale px-1 text-[9px] font-bold uppercase">Hot</span></span> : l.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>
      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
}
