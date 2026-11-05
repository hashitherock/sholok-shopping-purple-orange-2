import { createFileRoute } from "@tanstack/react-router";
import { trendingProducts } from "@/data/catalog";
import { PageHero } from "@/components/shop/bits";
import { ProductGrid } from "@/components/shop/ProductCard";

export const Route = createFileRoute("/trending")({
  head: () => ({
    meta: [
      { title: "Trending Products — Sholok" },
      { name: "description", content: "The most popular products shoppers are buying on Sholok right now." },
      { property: "og:title", content: "Trending Products — Sholok" },
      { property: "og:description", content: "See what's popular on Sholok this week." },
    ],
  }),
  component: () => (
    <>
      <PageHero title="Trending Items" crumb="Trending" />
      <div className="container-x py-8"><ProductGrid products={trendingProducts} /></div>
    </>
  ),
});
