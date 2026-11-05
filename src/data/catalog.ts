import {
  Shirt, Sparkles, Droplets, ShoppingBag, HeartPulse, Baby, CookingPot,
  SprayCan, PenTool, PawPrint, Volleyball, Car, User,
  type LucideIcon,
} from "lucide-react";
import pWomen from "@/assets/p-women.jpg";
import pMen from "@/assets/p-men.jpg";
import pBeauty from "@/assets/p-beauty.jpg";
import pCare from "@/assets/p-care.jpg";
import pFashion from "@/assets/p-fashion.jpg";
import pSneakers from "@/assets/p-sneakers.jpg";
import pHealth from "@/assets/p-health.jpg";
import pBaby from "@/assets/promo-2.jpg";
import pKitchen from "@/assets/p-kitchen.jpg";
import pCleaning from "@/assets/p-cleaning.jpg";
import pOffice from "@/assets/p-office.jpg";
import pPet from "@/assets/promo-4.jpg";
import pToys from "@/assets/p-toys.jpg";
import pVehicle from "@/assets/p-vehicle.jpg";

export type Category = { slug: string; name: string; icon: LucideIcon; related: string[] };

export const categories: Category[] = [
  { slug: "womens-clothing", name: "Women's Clothing", icon: Shirt, related: ["fashion-lifestyle", "beauty-makeup"] },
  { slug: "mens-clothing", name: "Men's Clothing", icon: User, related: ["fashion-lifestyle"] },
  { slug: "beauty-makeup", name: "Beauty & Makeup", icon: Sparkles, related: ["personal-care"] },
  { slug: "personal-care", name: "Personal Care", icon: Droplets, related: ["beauty-makeup", "health-wellness"] },
  { slug: "fashion-lifestyle", name: "Fashion & Lifestyle", icon: ShoppingBag, related: ["womens-clothing", "mens-clothing"] },
  { slug: "health-wellness", name: "Health & Wellness", icon: HeartPulse, related: ["personal-care"] },
  { slug: "baby-care", name: "Baby Care", icon: Baby, related: ["toys-sports"] },
  { slug: "home-kitchen", name: "Home & Kitchen", icon: CookingPot, related: ["cleaning-supplies"] },
  { slug: "cleaning-supplies", name: "Cleaning Supplies", icon: SprayCan, related: ["home-kitchen"] },
  { slug: "stationery-office", name: "Stationery & Office", icon: PenTool, related: ["toys-sports"] },
  { slug: "pet-care", name: "Pet Care", icon: PawPrint, related: ["home-kitchen"] },
  { slug: "toys-sports", name: "Toys & Sports", icon: Volleyball, related: ["baby-care"] },
  { slug: "vehicle-essentials", name: "Vehicle Essentials", icon: Car, related: ["cleaning-supplies"] },
];

export const categoryBySlug = (slug: string) => categories.find((c) => c.slug === slug);

export type Product = {
  id: string;
  name: string;
  category: string;
  image: string;
  price: number;
  oldPrice: number;
  rating: number;
  reviews: number;
  stock: number;
  sold: number;
  popularity: number;
  flash?: boolean;
  tags: string[];
  description: string;
};

const img: Record<string, string> = {
  "womens-clothing": pWomen, "mens-clothing": pMen, "beauty-makeup": pBeauty, "personal-care": pCare,
  "fashion-lifestyle": pFashion, "health-wellness": pHealth, "baby-care": pBaby, "home-kitchen": pKitchen,
  "cleaning-supplies": pCleaning, "stationery-office": pOffice, "pet-care": pPet, "toys-sports": pToys,
  "vehicle-essentials": pVehicle,
};

type Seed = [name: string, category: string, price: number, oldPrice: number, tags: string, extra?: Partial<Product>];

const seeds: Seed[] = [
  ["Floral Cotton Kurti", "womens-clothing", 1290, 1690, "kurti dress", { flash: true }],
  ["Embroidered Three-Piece Set", "womens-clothing", 2450, 3200, "salwar three piece"],
  ["Georgette Party Saree", "womens-clothing", 3890, 4500, "saree party"],
  ["Checked Casual Shirt", "mens-clothing", 990, 1350, "shirt casual", { flash: true }],
  ["Slim Fit Chino Pant", "mens-clothing", 1450, 1800, "pant chino"],
  ["Classic Cotton Panjabi", "mens-clothing", 1890, 2400, "panjabi eid"],
  ["Velvet Matte Lipstick", "beauty-makeup", 450, 650, "lipstick makeup", { flash: true }],
  ["Nude Eyeshadow Palette", "beauty-makeup", 1150, 1600, "eyeshadow palette makeup"],
  ["Glow Serum Foundation", "beauty-makeup", 1350, 1500, "foundation makeup"],
  ["Aloe Herbal Shampoo", "personal-care", 380, 450, "shampoo hair"],
  ["Coconut Body Wash", "personal-care", 420, 520, "body wash", { flash: true }],
  ["Charcoal Face Wash", "personal-care", 290, 350, "face wash skin", { stock: 0 }],
  ["Leather Tote Handbag", "fashion-lifestyle", 2790, 3900, "bag handbag", { flash: true }],
  ["Classic White Sneakers", "fashion-lifestyle", 2190, 2990, "sneakers shoes", { image: pSneakers }],
  ["Running Sneakers Pro", "fashion-lifestyle", 2650, 3300, "sneakers shoes sports", { image: pSneakers }],
  ["Tortoise Sunglasses", "fashion-lifestyle", 850, 1200, "sunglasses"],
  ["Vitamin D3 5000 IU", "health-wellness", 690, 850, "vitamin supplement"],
  ["Smart Fitness Band", "health-wellness", 2290, 2990, "fitness band watch", { flash: true }],
  ["Gentle Baby Lotion", "baby-care", 520, 640, "baby lotion"],
  ["Ultra Soft Diapers (56 pcs)", "baby-care", 1290, 1490, "diaper baby", { flash: true }],
  ["Non-Stick Frying Pan Set", "home-kitchen", 1890, 2600, "pan cookware kitchen", { flash: true }],
  ["Ceramic Dinner Bowl Set", "home-kitchen", 990, 1300, "bowl kitchen"],
  ["Multi-Surface Cleaner", "cleaning-supplies", 320, 380, "cleaner spray"],
  ["Laundry Liquid 2L", "cleaning-supplies", 650, 780, "detergent laundry"],
  ["Spiral Notebook Pack", "stationery-office", 390, 480, "notebook stationery"],
  ["Mesh Desk Organizer", "stationery-office", 750, 990, "organizer office"],
  ["Premium Dog Food 4kg", "pet-care", 2350, 2700, "dog food pet", { flash: true }],
  ["Cat Toy Combo", "pet-care", 480, 650, "cat toy pet"],
  ["Building Blocks 60 pcs", "toys-sports", 1190, 1590, "toy blocks kids"],
  ["Pro Football Size 5", "toys-sports", 890, 1100, "football sports", { stock: 0 }],
  ["Car Shampoo & Wax", "vehicle-essentials", 590, 750, "car shampoo"],
  ["Car Phone Holder", "vehicle-essentials", 690, 990, "phone holder car", { flash: true }],
];

// Deterministic pseudo-random from index so SSR and client agree.
const rand = (i: number, mod: number) => ((i * 9301 + 49297) % 233280) % mod;

export const products: Product[] = seeds.map(([name, category, price, oldPrice, tags, extra], i) => ({
  id: `p${i + 1}`,
  name,
  category,
  image: img[category],
  price,
  oldPrice,
  rating: 3.8 + rand(i, 12) / 10,
  reviews: 12 + rand(i + 7, 480),
  stock: 5 + rand(i + 3, 60),
  sold: 10 + rand(i + 11, 90),
  popularity: rand(i + 5, 1000),
  tags: tags.split(" "),
  description: `${name} from Sholok — carefully selected for quality, comfort and everyday value. Genuine product, fast delivery across Bangladesh, and easy 7-day returns.`,
  ...extra,
})).map((p) => ({ ...p, rating: Math.min(5, Math.round(p.rating * 10) / 10) }));

export const productById = (id: string) => products.find((p) => p.id === id);
export const discountPct = (p: Product) => Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100);
export const taka = (n: number) => `৳${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
export const inStock = (p: Product) => p.stock > 0;

export const flashProducts = products.filter((p) => p.flash);
export const trendingProducts = [...products].sort((a, b) => b.popularity - a.popularity).slice(0, 12);

/** Flash sale ends at the next local midnight + 2 days (predefined, local). */
export const flashSaleEnd = () => {
  const d = new Date();
  d.setHours(23, 59, 59, 0);
  d.setDate(d.getDate() + 2);
  return d.getTime();
};

export const deliveryLocations = ["Dhaka", "Chattogram", "Sylhet", "Rajshahi", "Khulna", "Barishal", "Rangpur", "Mymensingh"];

export const PHONE = "+880 1700-000000";
