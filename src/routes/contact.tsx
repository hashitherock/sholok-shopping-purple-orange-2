import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { toast } from "sonner";
import { PHONE } from "@/data/catalog";
import { PageHero } from "@/components/shop/bits";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — Sholok Shopping" },
      { name: "description", content: "Get in touch with the Sholok support team." },
      { property: "og:title", content: "Contact Sholok" },
      { property: "og:description", content: "We're here to help with orders and questions." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    const err: Record<string, string> = {};
    if (!String(f.get("name")).trim()) err.name = "Name is required";
    if (!/^\S+@\S+\.\S+$/.test(String(f.get("email")))) err.email = "Enter a valid email";
    if (String(f.get("message")).trim().length < 10) err.message = "Message must be at least 10 characters";
    setErrors(err);
    if (Object.keys(err).length) return;
    form.reset();
    toast.success("Message sent!", { description: "Demo only — we'll never actually email you." });
  };
  const info = [
    { icon: Phone, label: "Phone", value: PHONE },
    { icon: Mail, label: "Email", value: "support@sholok.com" },
    { icon: MapPin, label: "Address", value: "Gulshan-1, Dhaka 1212" },
    { icon: Clock, label: "Hours", value: "Sat–Thu, 9am – 10pm" },
  ];
  return (
    <>
      <PageHero title="Contact Us" crumb="Contact" />
      <div className="container-x grid gap-8 py-10 lg:grid-cols-[360px_1fr]">
        <div className="space-y-3">
          {info.map((i) => (
            <div key={i.label} className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-primary-soft"><i.icon className="h-5 w-5 text-primary" /></span>
              <div><p className="text-xs text-muted-foreground">{i.label}</p><p className="font-bold">{i.value}</p></div>
            </div>
          ))}
        </div>
        <form onSubmit={onSubmit} noValidate className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-card">
          <h2 className="text-2xl font-extrabold">Send us a message</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><input name="name" placeholder="Your name" className="field" aria-label="Your name" />{errors.name && <p className="mt-1 text-xs text-sale">{errors.name}</p>}</div>
            <div><input name="email" type="email" placeholder="Email address" className="field" aria-label="Email" />{errors.email && <p className="mt-1 text-xs text-sale">{errors.email}</p>}</div>
          </div>
          <input name="subject" placeholder="Subject (optional)" className="field" aria-label="Subject" />
          <div><textarea name="message" rows={6} placeholder="How can we help?" className="field resize-none" aria-label="Message" />{errors.message && <p className="mt-1 text-xs text-sale">{errors.message}</p>}</div>
          <button type="submit" className="btn-primary">Send Message</button>
        </form>
      </div>
    </>
  );
}
