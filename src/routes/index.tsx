import { createFileRoute } from "@tanstack/react-router";
import {
  CategorySidebar, FlashSaleSection, HeroSlider, MobileCategoryStrip, MoreToLove, PromoBanners, TrendingSection, VegBanner,
} from "@/components/shop/HomeSections";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sholok Shopping — Fashion, Beauty & Home Online in Bangladesh" },
      { name: "description", content: "Shop women's & men's clothing, beauty, home, baby care and more at Sholok. Daily flash sales and fast delivery." },
      { property: "og:title", content: "Sholok Shopping — Shop Everything You Love" },
      { property: "og:description", content: "Fashion, beauty, home and daily essentials with flash sale deals." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="container-x space-y-10 pb-4">
      <div className="flex gap-5 pt-4 lg:pt-0">
        <CategorySidebar />
        <HeroSlider />
      </div>
      <MobileCategoryStrip />
      <PromoBanners />
      <FlashSaleSection />
      <TrendingSection />
      <VegBanner />
      <MoreToLove />
    </div>
  );
}
