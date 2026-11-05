import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { BadgeCheck, BarChart3, CheckCircle2, Truck, Users, Wallet } from "lucide-react";
import { toast } from "sonner";
import { Reveal } from "@/components/shop/bits";

export const Route = createFileRoute("/become-a-seller")({
  head: () => ({
    meta: [
      { title: "Become a Seller — Grow Your Business with Sholok" },
      { name: "description", content: "Sell on Sholok and reach shoppers across Bangladesh with easy tools and fast payouts." },
      { property: "og:title", content: "Become a Seller on Sholok" },
      { property: "og:description", content: "Reach millions of shoppers across Bangladesh." },
    ],
  }),
  component: SellerPage,
});

const benefits = [
  { icon: Users, title: "Millions of shoppers", text: "Reach customers in all 64 districts." },
  { icon: Wallet, title: "Fast payouts", text: "Get paid weekly, straight to bKash or bank." },
  { icon: Truck, title: "Delivery handled", text: "We pick up, pack and deliver for you." },
  { icon: BarChart3, title: "Seller dashboard", text: "Track orders, stock and sales in one place." },
  { icon: BadgeCheck, title: "Zero setup fee", text: "Start selling today at no upfront cost." },
];

function SellerPage() {
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const err: { [k: string]: string } = {};
    if (!String(f.get("name")).trim()) err["name"] = "Please enter your name";
    if (!String(f.get("shop")).trim()) err["shop"] = "Please enter your shop name";
    if (!/^01\d{9}$/.test(String(f.get("phone")).replace(/\D/g, "").replace(/^880/, "0"))) err["phone"] = "Enter a valid 11-digit mobile number";
    setErrors(err);
    if (Object.keys(err).length) return;
    setSent(true);
    toast.success("Thanks! This is a demo — no application was sent.");
  };
  return (
    <>
      <section className="bg-primary text-primary-foreground">
        <div className="container-x grid items-center gap-8 py-14 lg:grid-cols-2">
          <div className="animate-fade-up space-y-4">
            <span className="inline-block rounded-full bg-sale px-3 py-1 text-xs font-bold uppercase">0% commission for 3 months</span>
            <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">Grow your business with SHOLOK</h1>
            <p className="max-w-lg text-lg opacity-90">Join thousands of sellers who trust Sholok to reach new customers every day.</p>
            <div className="flex gap-8 pt-2">
              {[["10K+", "Sellers"], ["2M+", "Shoppers"], ["64", "Districts"]].map(([n, l]) => (
                <div key={l}><p className="font-display text-3xl font-extrabold">{n}</p><p className="text-sm opacity-80">{l}</p></div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl bg-card p-6 text-card-foreground shadow-lift">
            {sent ? (
              <div className="flex flex-col items-center gap-3 py-10 text-center">
                <CheckCircle2 className="h-14 w-14 text-success" />
                <p className="text-xl font-bold">Application received!</p>
                <p className="text-sm text-muted-foreground">This is a demo form — nothing was submitted.</p>
                <button onClick={() => setSent(false)} className="btn-outline mt-2">Submit another</button>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate className="space-y-3">
                <h2 className="text-xl font-extrabold">Start selling today</h2>
                {([["name", "Your full name"], ["shop", "Shop name"], ["phone", "Mobile number (01XXXXXXXXX)"]] as const).map(([n, ph]) => (
                  <div key={n}>
                    <input name={n} placeholder={ph} className="field" aria-label={ph} />
                    {errors[n] && <p className="mt-1 text-xs text-sale">{errors[n]}</p>}
                  </div>
                ))}
                <select name="category" className="field" aria-label="Main category" defaultValue="">
                  <option value="" disabled>What will you sell?</option>
                  <option>Fashion</option><option>Beauty</option><option>Home & Kitchen</option><option>Other</option>
                </select>
                <button type="submit" className="btn-sale w-full">Register as Seller</button>
              </form>
            )}
          </div>
        </div>
      </section>
      <section className="container-x py-14">
        <h2 className="mb-8 text-center text-3xl font-extrabold">Why sell on Sholok?</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {benefits.map((b, i) => (
            <Reveal key={b.title} delay={i * 80}>
              <div className="h-full rounded-xl border border-border bg-card p-5 transition hover:-translate-y-1 hover:shadow-lift">
                <span className="mb-3 grid h-12 w-12 place-items-center rounded-xl bg-primary-soft"><b.icon className="h-6 w-6 text-primary" /></span>
                <h3 className="font-bold">{b.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{b.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
