import Overlay from "./Overlay";

export default function HowToPlay({ onClose }: { onClose: () => void }) {
  return (
    <Overlay title="How to play Tradewinds" onClose={onClose}>
      <div className="space-y-4 text-sm leading-relaxed" style={{ color: "var(--tw-text)" }}>
        <p>
          Every day, Tradewinds gives you a cargo manifest from one real historical
          trade voyage. You have <strong>10 guesses</strong> to reconstruct three
          things at once, fused into a single combined guess each turn:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <strong>🧭 Route</strong> — the origin and destination.
          </li>
          <li>
            <strong>📅 Era</strong> — the decade the voyage took place.
          </li>
          <li>
            <strong>💰 Economic role</strong> — what the voyage's leg was doing
            economically (source producer, entrepôt, end consumer market, colonial
            extractor, or re-export hub).
          </li>
        </ul>
        <p>
          These aren't three separate puzzles — they're the same manifest read
          three ways. The goods tell you the geography. The prices and currency
          tell you the economic role. The combination of goods and currency pins
          down the era. You can't solve one axis in isolation.
        </p>
        <div className="rounded border p-3" style={{ borderColor: "var(--tw-border)", backgroundColor: "var(--tw-surface-2)" }}>
          <p className="font-medium mb-1">Worked example</p>
          <p>
            A manifest lists raw silk, porcelain, and silver coin stamped with a
            Spanish mint mark. Silk and porcelain point toward East Asia; Spanish
            silver points across the Pacific — together they suggest a Manila
            galleon route, not an Atlantic one. The mint mark also narrows the
            era: that particular coinage only circulated for a few decades. And
            silver flowing <em>into</em> Asia in exchange for finished goods reads
            as an end consumer market paying a premium, not a source producer
            selling at cost.
          </p>
        </div>
        <p>Each guess gives feedback on all three axes at once:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <strong>Route</strong> — green if both endpoints are right, yellow if
            one endpoint (or the right ocean/region) is right, grey otherwise. A
            compass direction always points toward the true corridor.
          </li>
          <li>
            <strong>Era</strong> — green if exact, yellow within two decades. A
            ▲ or ▼ shows whether the truth is later or earlier.
          </li>
          <li>
            <strong>Role</strong> — green if correct. Otherwise a nudge
            ("undervalued" or "overvalued") tells you whether the true role
            implies a higher or lower margin than your guess.
          </li>
        </ul>
        <p>
          Win by getting all three green in the same guess. The manifest reveals
          a little more after guesses 3, 5, and 7, so no game ever dead-ends
          before guess 10.
        </p>
      </div>
    </Overlay>
  );
}
