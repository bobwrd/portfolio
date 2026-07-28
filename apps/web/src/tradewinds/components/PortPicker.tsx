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
}

/** A plain `<input list>` combobox over the shared port datalist — free
 * keyboard navigation and screen-reader support from the browser itself. */
export default function PortPicker({ label, query, onChange, disabled }: PortPickerProps) {
  const inputId = `tw-port-${label.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <div>
      <label htmlFor={inputId} className="block text-xs font-medium mb-1" style={{ color: "var(--tw-muted)" }}>
        {label}
      </label>
      <input
        id={inputId}
        list={PORT_DATALIST_ID}
        value={query}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search ports, hubs, or regions…"
        className="w-full rounded border px-3 py-2 text-sm bg-transparent outline-none focus:ring-1"
        style={{ borderColor: "var(--tw-border)", color: "var(--tw-text)" }}
      />
    </div>
  );
}
