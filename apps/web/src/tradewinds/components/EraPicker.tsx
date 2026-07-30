import { ERAS } from "@portfolio/tradewinds";

interface EraPickerProps {
  value: string | null;
  onChange: (eraId: string) => void;
  disabled?: boolean;
}

export default function EraPicker({ value, onChange, disabled }: EraPickerProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
      {ERAS.map((era) => {
        const selected = value === era.id;
        return (
          <button
            key={era.id}
            type="button"
            disabled={disabled}
            onClick={() => onChange(era.id)}
            aria-pressed={selected}
            className="rounded border px-2.5 py-1.5 text-left text-sm transition-colors disabled:cursor-not-allowed"
            style={{
              borderColor: selected ? "var(--tw-accent)" : "var(--tw-border)",
              backgroundColor: selected ? "var(--tw-accent-dim)" : "transparent",
              color: "var(--tw-text)",
            }}
          >
            <span className="block font-medium leading-tight">{era.label}</span>
            <span className="block text-xs" style={{ color: "var(--tw-muted)" }}>
              {era.range}
            </span>
          </button>
        );
      })}
    </div>
  );
}
