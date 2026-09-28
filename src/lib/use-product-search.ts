"use client";

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import type { SearchResults } from "@/app/api/search/route";

/**
 * The header search box's behaviour, shared by every template (each draws its own markup):
 * debounced live suggestions from the same-origin /api/search, click-outside to close, and
 * ↑/↓/Enter/Esc keyboard navigation across the category + product suggestions.
 */
export function useProductSearch() {
  const router = useRouter();
  const [q, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResults | null>(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);

  // Debounced fetch against the same-origin /api/search route.
  useEffect(() => {
    const query = q.trim();
    if (query.length < 2) {
      setResults(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    const ac = new AbortController();
    const timer = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(query)}`, { signal: ac.signal })
        .then((r) => r.json() as Promise<SearchResults>)
        .then((data) => {
          setResults(data);
          setActiveIndex(-1);
        })
        .catch(() => {
          if (!ac.signal.aborted) setResults({ query, categories: [], products: [] });
        })
        .finally(() => setLoading(false));
    }, 250);
    return () => {
      clearTimeout(timer);
      ac.abort();
    };
  }, [q]);

  // Click outside → close.
  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  /** Every suggestion's href in display order (categories first) — the keyboard cursor's index space. */
  const flat = useMemo(() => {
    if (!results) return [] as string[];
    return [
      ...results.categories.map((c) => `/products/${c.slug}`),
      ...results.products.map((p) => `/product/${encodeURIComponent(p.id)}`),
    ];
  }, [results]);

  function setQ(value: string) {
    setQuery(value);
    setOpen(true);
  }

  function clear() {
    setQuery("");
    setResults(null);
  }

  function goFullResults() {
    if (q.trim().length < 2) return;
    setOpen(false);
    router.push(`/products?q=${encodeURIComponent(q.trim())}`);
  }

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === "Escape") {
      setOpen(false);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActiveIndex((i) => Math.min(flat.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(-1, i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && flat[activeIndex]) {
        setOpen(false);
        router.push(flat[activeIndex]);
      } else {
        goFullResults();
      }
    }
  }

  const hasResults = Boolean(results && (results.categories.length > 0 || results.products.length > 0));

  return {
    q,
    setQ,
    clear,
    open,
    setOpen,
    close: () => setOpen(false),
    loading,
    results,
    activeIndex,
    rootRef,
    onKeyDown,
    goFullResults,
    hasResults,
    /** the suggestions panel should be visible */
    showPanel: open && q.trim().length >= 2,
  };
}
