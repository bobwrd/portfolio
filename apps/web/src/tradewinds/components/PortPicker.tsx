import type { Port } from "@portfolio/tradewinds";

export const PORT_DATALIST_ID = "tradewinds-port-options";

export function PortDatalist({ ports }: { ports: Port[] }) {
  return (
    <datalist id={PORT_DATALIST_ID}>
      {ports.map((p) => (
        <option key={p.id} value={p.name}>
          {p.region}
        </option>
      ))}
    </datalist>
  );
}

interface PortPickerProps {
  label: string;
  query: string;
  onChange: (query: string) => void;
  disabled?: boolean;
  /** Solved on an earlier guess — shown filled in and frozen. */
  locked?: boolean;
}

/** A plain `<input list>` combobox over the shared port datalist — free
 * keyboard navigation and screen-reader support from the browser itself. */
export default function PortPicker({ label, query, onChange, disabled, locked }: PortPickerProps) {
  const inputId = `tw-port-${label.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <div>
      <label htmlFor={inputId} className="flex items-center gap-1.5 text-xs font-medium mb-1" style={{ color: "var(--tw-muted)" }}>
        {label}
        {locked && <LockedBadge />}
      </label>
      <input
        id={inputId}
        list={locked ? undefined : PORT_DATALIST_ID}
        value={query}
        disabled={disabled || locked}
        readOnly={locked}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search ports, hubs, or regions…"
        className="w-full rounded border px-3 py-2 text-sm bg-transparent outline-none focus:ring-1 disabled:cursor-not-allowed"
        style={{
          borderColor: locked ? "var(--tw-green)" : "var(--tw-border)",
          color: "var(--tw-text)",
          opacity: locked ? 1 : undefined,
        }}
      />
    </div>
  );
}

export function LockedBadge() {
  return (
    <span
      className="rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white"
      style={{ backgroundColor: "var(--tw-green)" }}
    >
      Locked
    </span>
  );
}
