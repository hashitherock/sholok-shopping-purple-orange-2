import { describe, expect, it } from "vitest";
import { products } from "@/data/catalog";
import { recommend } from "@/lib/recommend";

describe("More to love recommendations", () => {
  it("never shows out-of-stock products", () => {
    expect(recommend(products, null, 42).every((p) => p.stock > 0)).toBe(true);
    expect(recommend(products, "football", 42).some((p) => p.name.includes("Football"))).toBe(false);
  });
  it("has no duplicates", () => {
    const ids = recommend(products, "beauty", 7, 40).map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
  it("puts sneakers first after searching sneakers", () => {
    const r = recommend(products, "Sneakers", 3);
    expect(r.slice(0, 2).every((p) => p.tags.includes("sneakers"))).toBe(true);
  });
  it("puts women's clothing first after searching Women's Clothing", () => {
    const r = recommend(products, "Women's Clothing", 3);
    expect(r.slice(0, 3).every((p) => p.category === "womens-clothing")).toBe(true);
  });
  it("keeps the same order for the same session seed", () => {
    expect(recommend(products, null, 99).map((p) => p.id)).toEqual(recommend(products, null, 99).map((p) => p.id));
  });
});
