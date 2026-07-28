import type { ManifestRow } from "@portfolio/tradewinds";

interface ManifestProps {
  rows: ManifestRow[];
  currencyName: string;
  totalRows: number;
}

export default function Manifest({ rows, currencyName, totalRows }: ManifestProps) {
  return (
    <div
      className="rounded-lg border p-5"
      style={{ backgroundColor: "var(--tw-surface)", borderColor: "var(--tw-border)" }}
    >
      <div className="flex items-baseline justify-between gap-2 mb-3">
        <h2 className="text-sm font-semibold tracking-wide uppercase" style={{ color: "var(--tw-muted)" }}>
          Cargo manifest
        </h2>
        <span className="text-xs" style={{ color: "var(--tw-muted)" }}>
          {rows.length} of {totalRows} entries visible
        </span>
      </div>

      <p className="text-xs mb-4" style={{ color: "var(--tw-muted)" }}>
        Prices recorded in <strong>{currencyName}</strong>.
      </p>

      <ul className="space-y-3">
        {rows.map((row, i) => (
          <li
            key={i}
            className="border-b pb-3 last:border-b-0 last:pb-0"
            style={{ borderColor: "var(--tw-border)" }}
          >
            <div className="flex items-baseline justify-between gap-3">
              <span className="font-medium" style={{ color: "var(--tw-text)" }}>
                {row.good}
              </span>
              {row.quantity && (
                <span className="text-sm shrink-0" style={{ color: "var(--tw-muted)" }}>
                  {row.quantity}
                </span>
              )}
            </div>
            {row.price && (
              <div className="text-sm mt-0.5" style={{ color: "var(--tw-text)" }}>
                {row.price}
              </div>
            )}
            {row.note && (
              <div className="text-sm italic mt-1" style={{ color: "var(--tw-muted)" }}>
                {row.note}
              </div>
            )}
          </li>
        ))}
      </ul>

      {rows.length < totalRows && (
        <p className="text-xs mt-4 pt-3 border-t" style={{ color: "var(--tw-muted)", borderColor: "var(--tw-border)" }}>
          More of the manifest will surface as you guess — after guesses 3, 5, and 7.
        </p>
      )}
    </div>
  );
}
