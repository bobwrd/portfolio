import { useEffect, useRef, useState } from "react";

// Reads the OS "reduce motion" preference and tracks changes. Sections use it
// to swap scroll-driven autoplay for a click-to-play interactive state.
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);
  return reduced;
}

// Scroll progress (0..1) of an element through the viewport. A single passive
// listener, throttled with requestAnimationFrame so the scroll thread stays
// cheap. Progress is 0 when the element's top hits the bottom of the viewport
// and 1 when its bottom passes the top.
export function useScrollProgress(ref: React.RefObject<HTMLElement | null>): number {
  const [progress, setProgress] = useState(0);
  const ticking = useRef(false);

  useEffect(() => {
    const compute = () => {
      ticking.current = false;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const total = rect.height + vh;
      const seen = vh - rect.top;
      setProgress(Math.max(0, Math.min(1, seen / total)));
    };
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(compute);
    };
    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ref]);

  return progress;
}

// Fires `onEnter` once, the first time the element is at least `threshold`
// visible. Used to kick off an autoplay sequence on scroll-in.
export function useEnterOnce(
  ref: React.RefObject<HTMLElement | null>,
  onEnter: () => void,
  threshold = 0.35
) {
  const fired = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !fired.current) {
            fired.current = true;
            onEnter();
          }
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref]);
}

// rAF-driven autoplay over a number of steps. Advances one step every
// `stepMs`, then stops and marks `done`. Pauses immediately if the user takes
// control. Skipped entirely under reduced motion (caller handles that).
export function useAutoplay(
  active: boolean,
  steps: number,
  stepMs: number,
  onStep: (i: number) => void,
  onDone?: () => void
) {
  const raf = useRef<number | null>(null);
  const start = useRef<number | null>(null);
  const lastStep = useRef(-1);

  useEffect(() => {
    if (!active) return;
    start.current = null;
    lastStep.current = -1;

    const tick = (now: number) => {
      if (start.current == null) start.current = now;
      const elapsed = now - start.current;
      const i = Math.min(steps - 1, Math.floor(elapsed / stepMs));
      if (i !== lastStep.current) {
        lastStep.current = i;
        onStep(i);
      }
      if (i >= steps - 1) {
        onDone?.();
        return;
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);

    return () => {
      if (raf.current != null) cancelAnimationFrame(raf.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, steps, stepMs]);
}
