import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone, ShieldCheck, Truck, RotateCcw, Headphones } from "lucide-react";
import { categories, PHONE } from "@/data/catalog";

const perks = [
  { icon: Truck, title: "Fast Delivery", text: "Across all 64 districts" },
  { icon: RotateCcw, title: "Easy Returns", text: "7-day hassle-free returns" },
  { icon: ShieldCheck, title: "100% Genuine", text: "Authentic products only" },
  { icon: Headphones, title: "24/7 Support", text: "We're always here" },
];

export function Footer() {
  return (
    <footer className="mt-16 bg-primary-deep text-primary-foreground">
      <div className="container-x grid grid-cols-2 gap-4 border-b border-primary-foreground/15 py-8 lg:grid-cols-4">
        {perks.map((p) => (
          <div key={p.title} className="flex items-center gap-3">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-primary-foreground/10"><p.icon className="h-6 w-6" /></span>
            <div><p className="font-bold">{p.title}</p><p className="text-xs opacity-75">{p.text}</p></div>
          </div>
        ))}
      </div>
      <div className="container-x grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link to="/" className="font-logo text-3xl">SHOLOK</Link>
          <p className="mt-3 text-sm opacity-80">Your everyday online shop for fashion, beauty, home and more — delivered across Bangladesh.</p>
        </div>
        <div>
          <h3 className="mb-3 font-bold">Categories</h3>
          <ul className="grid grid-cols-1 gap-1.5 text-sm opacity-80">
            {categories.slice(0, 7).map((c) => <li key={c.slug}><Link to="/shop" search={{ cat: c.slug }} className="hover:underline">{c.name}</Link></li>)}
          </ul>
        </div>
        <div>
          <h3 className="mb-3 font-bold">Quick Links</h3>
          <ul className="space-y-1.5 text-sm opacity-80">
            <li><Link to="/shop" className="hover:underline">Shop</Link></li>
            <li><Link to="/flash-sale" className="hover:underline">Flash Sale</Link></li>
            <li><Link to="/trending" className="hover:underline">Trending</Link></li>
            <li><Link to="/wishlist" className="hover:underline">Wishlist</Link></li>
            <li><Link to="/become-a-seller" className="hover:underline">Become a Seller</Link></li>
            <li><Link to="/contact" className="hover:underline">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 font-bold">Contact</h3>
          <ul className="space-y-2 text-sm opacity-80">
            <li className="flex gap-2"><MapPin className="h-4 w-4 shrink-0" /> Gulshan-1, Dhaka 1212</li>
            <li className="flex gap-2"><Phone className="h-4 w-4 shrink-0" /> {PHONE}</li>
            <li className="flex gap-2"><Mail className="h-4 w-4 shrink-0" /> support@sholok.com</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-foreground/15 py-4 text-center text-xs opacity-70">© 2026 Sholok Shopping. All rights reserved.</div>
    </footer>
  );
}
