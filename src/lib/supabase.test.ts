import { describe, expect, it } from "bun:test";
import { normalizeCategoryFilter } from "./supabase";

describe("normalizeCategoryFilter", () => {
  it("matches the lowercase category labels stored in Newsflash", () => {
    expect(normalizeCategoryFilter("Business")).toBe("business");
    expect(normalizeCategoryFilter("Technology")).toBe("technology");
  });

  it("removes surrounding whitespace before matching", () => {
    expect(normalizeCategoryFilter("  Health  ")).toBe("health");
  });
});