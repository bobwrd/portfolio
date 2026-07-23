import { useEffect } from "react";
import Intro from "./sections/Intro";
import Chapter1 from "./sections/Chapter1";
import Chapter2 from "./sections/Chapter2";
import Chapter3 from "./sections/Chapter3";
import Chapter4 from "./sections/Chapter4";
import Methodology from "./sections/Methodology";

export default function ArenaIndex() {
  useEffect(() => {
    document.title = "Arin Jain — The Arena: Competition and Efficiency";
  }, []);

  return (
    <>
      <Intro />
      <Chapter1 />
      <Chapter2 />
      <Chapter3 />
      <Chapter4 />
      <Methodology />

      {/* Cross-links */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-16 pt-4 border-t" style={{ borderColor: "var(--arena-border)" }}>
        <p className="text-xs mb-3" style={{ color: "var(--arena-muted)" }}>Related work:</p>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <a href="/mini/observatory" className="hover:underline" style={{ color: "var(--arena-accent)" }}>
            The Observatory — AI, productivity and prices →
          </a>
          <a href="/mini/verdict" className="hover:underline" style={{ color: "var(--arena-accent)" }}>
            The Verdict — tracking AI regulation as it happens →
          </a>
          <a href="/why" className="hover:underline" style={{ color: "var(--arena-accent)" }}>
            Why this question →
          </a>
        </div>
      </div>
    </>
  );
}
