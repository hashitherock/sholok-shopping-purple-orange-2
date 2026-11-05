import { categories, inStock, type Product } from "@/data/catalog";

/** Seeded shuffle so order is stable for a given session seed. */
export function seededShuffle<T>(arr: T[], seed: number): T[] {
  const a = [...arr];
  let s = seed || 1;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 16807) % 2147483647;
    const j = s % (i + 1);
    [a[i], a[j]] = [a[j] as T, a[i] as T];
  }
  return a;
}

export function matchScore(p: Product, query: string): number {
  const q = query.trim().toLowerCase();
  if (!q) return 0;
  const words = q.split(/\s+/).filter(Boolean);
  const cat = categories.find((c) => c.slug === p.category);
  let score = 0;
  for (const w of words) {
    const stem = w.replace(/s$/, "");
    if (p.name.toLowerCase().includes(stem)) score += 5;
    if (p.tags.some((t) => t.includes(stem))) score += 4;
    if (cat && cat.name.toLowerCase().includes(stem)) score += 3;
  }
  return score;
}

export function searchProducts(all: Product[], query: string): Product[] {
  return all
    .map((p) => ({ p, s: matchScore(p, query) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .map((x) => x.p);
}

/**
 * More to love: in-stock, unique products. With a query: relevant first (shuffled
 * within), then related categories, then general fill. Without: seeded random.
 */
export function recommend(all: Product[], query: string | null, seed: number, limit = 18): Product[] {
  const pool = all.filter(inStock);
  if (!query) return seededShuffle(pool, seed).slice(0, limit);
  // Shuffle within equal-score tiers so best matches always come first.
  const scored = pool.map((p) => ({ p, s: matchScore(p, query) })).filter((x) => x.s > 0);
  const tiers = [...new Set(scored.map((x) => x.s))].sort((a, b) => b - a);
  const relevant = tiers.flatMap((t) => seededShuffle(scored.filter((x) => x.s === t).map((x) => x.p), seed));
  const relevantCats = new Set(relevant.map((p) => p.category));
  const relatedCats = new Set(
    [...relevantCats].flatMap((slug) => categories.find((c) => c.slug === slug)?.related ?? []),
  );
  const used = new Set(relevant.map((p) => p.id));
  const related = seededShuffle(pool.filter((p) => !used.has(p.id) && (relevantCats.has(p.category) || relatedCats.has(p.category))), seed);
  related.forEach((p) => used.add(p.id));
  const rest = seededShuffle(pool.filter((p) => !used.has(p.id)), seed);
  return [...relevant, ...related, ...rest].slice(0, limit);
}
