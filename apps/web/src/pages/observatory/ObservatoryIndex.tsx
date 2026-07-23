import { useEffect, useState } from "react";
import Intro from "./sections/Intro";
import Walkthrough from "./sections/Walkthrough";
import Atlas from "./sections/Atlas";
import Lab from "./sections/Lab";
import Methodology from "./sections/Methodology";
import { fetchObservatory, type ObservatoryData } from "./types";

export default function ObservatoryIndex() {
  const [data, setData] = useState<ObservatoryData | null>(null);
  const [country, setCountry] = useState("USA");
  const [error, setError] = useState(false);

  useEffect(() => {
    document.title = "Arin Jain — AI, Productivity and Prices";
    fetchObservatory()
      .then((d) => {
        setData(d);
        setCountry(d.default_country || "USA");
      })
      .catch(() => setError(true));
  }, []);

  return (
    <>
      <Intro />
      <Walkthrough data={data} country={country} />
      <Atlas data={data} country={country} setCountry={setCountry} />
      <Lab />
      <Methodology data={data} />
      {error && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-10">
          <p className="text-xs font-mono" style={{ color: "var(--obs-warn)" }}>
            Live data is temporarily unavailable; the walkthrough and lab still work.
          </p>
        </div>
      )}

      {/* Cross-links */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-16 pt-4 border-t" style={{ borderColor: "var(--obs-border)" }}>
        <p className="text-xs mb-3" style={{ color: "var(--obs-muted)" }}>Related work:</p>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <a href="/mini/verdict" className="hover:underline" style={{ color: "var(--obs-accent)" }}>
            The Verdict — tracking AI regulation as it happens →
          </a>
          <a href="/mini/arena" className="hover:underline" style={{ color: "var(--obs-accent)" }}>
            The Arena — when competition helps and when it wastes →
          </a>
          <a href="/others/access-to-justice-the-gap-nobody-measures" className="hover:underline" style={{ color: "var(--obs-accent)" }}>
            Access to Justice — The Gap Nobody Measures →
          </a>
          <a href="/why" className="hover:underline" style={{ color: "var(--obs-accent)" }}>
            Why this question →
          </a>
        </div>
      </div>
    </>
  );
}
