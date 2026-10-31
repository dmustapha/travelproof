"use client";
import { useEffect, useRef } from "react";

// Depth cue #1: layers shift at different rates with the cursor and the scroll, so stacked objects visibly separate.
export function DeskParallax({ className, children }: { className?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const move = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const mx = ((e.clientX - r.left) / r.width - 0.5) * 2, my = ((e.clientY - r.top) / r.height - 0.5) * 2;
      cancelAnimationFrame(raf); raf = requestAnimationFrame(() => { el.style.setProperty("--mx", mx.toFixed(3)); el.style.setProperty("--my", my.toFixed(3)); });
    };
    const scroll = () => { el.style.setProperty("--sy", String(Math.min(window.scrollY, 900))); };
    el.addEventListener("mousemove", move); window.addEventListener("scroll", scroll, { passive: true }); scroll();
    return () => { el.removeEventListener("mousemove", move); window.removeEventListener("scroll", scroll); cancelAnimationFrame(raf); };
  }, []);
  return <section ref={ref} className={className}>{children}</section>;
}
