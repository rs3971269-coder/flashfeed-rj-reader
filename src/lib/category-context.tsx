import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { CategoryKey } from "./categories";

type Ctx = {
  category: CategoryKey | null;
  setCategory: (c: CategoryKey | null) => void;
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
};

const CategoryCtx = createContext<Ctx | null>(null);

const STORAGE_KEY = "newsflash:category";

export function CategoryProvider({ children }: { children: ReactNode }) {
  const [category, setCategoryState] = useState<CategoryKey | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    try {
      const v = localStorage.getItem(STORAGE_KEY);
      if (v) setCategoryState(v as CategoryKey);
    } catch {}
  }, []);

  const setCategory = (c: CategoryKey | null) => {
    setCategoryState(c);
    try {
      if (c) localStorage.setItem(STORAGE_KEY, c);
      else localStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  return (
    <CategoryCtx.Provider value={{ category, setCategory, drawerOpen, setDrawerOpen }}>
      {children}
    </CategoryCtx.Provider>
  );
}

export function useCategory() {
  const ctx = useContext(CategoryCtx);
  if (!ctx) throw new Error("useCategory must be used within CategoryProvider");
  return ctx;
}