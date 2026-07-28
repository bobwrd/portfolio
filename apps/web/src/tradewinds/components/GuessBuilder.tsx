import { useState } from "react";
import {
  DECADE_STEP,
  ECONOMIC_ROLES,
  MAX_DECADE,
  MIN_DECADE,
  formatDecade,
  type EconomicRole,
  type Guess,
  type Port,
} from "@portfolio/tradewinds";
import PortPicker, { PortDatalist } from "./PortPicker";

interface GuessBuilderProps {
  ports: Port[];
  disabled: boolean;
  onSubmit: (guess: Guess) => void;
}

export default function GuessBuilder({ ports, disabled, onSubmit }: GuessBuilderProps) {
  const [originQuery, setOriginQuery] = useState("");
  const [destQuery, setDestQuery] = useState("");
  const [decade, setDecade] = useState(1500);
  const [role, setRole] = useState<EconomicRole | null>(null);

  const originPort = ports.find((p) => p.name === originQuery);
  const destPort = ports.find((p) => p.name === destQuery);
  const canSubmit = !disabled && !!originPort && !!destPort && !!role;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!originPort || !destPort || !role) return;
    onSubmit({
      originPortId: originPort.id,
      destinationPortId: destPort.id,
      decade,
      economicRole: role,
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border p-5 space-y-5"
      style={{ backgroundColor: "var(--tw-surface)", borderColor: "var(--tw-border)" }}
    >
      <h2 className="text-sm font-semibold tracking-wide uppercase" style={{ color: "var(--tw-muted)" }}>
        Make a guess
      </h2>

      <PortDatalist ports={ports} />

      <fieldset disabled={disabled} className="space-y-3">
        <legend className="sr-only">Route</legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <PortPicker label="Origin" query={originQuery} onChange={setOriginQuery} />
          <PortPicker label="Destination" query={destQuery} onChange={setDestQuery} />
        </div>
      </fieldset>

      <fieldset disabled={disabled}>
        <legend className="block text-xs font-medium mb-1" style={{ color: "var(--tw-muted)" }}>
          Decade — <span style={{ color: "var(--tw-text)" }}>{formatDecade(decade)}</span>
        </legend>
        <input
          type="range"
          min={MIN_DECADE}
          max={MAX_DECADE}
          step={DECADE_STEP}
          value={decade}
          onChange={(e) => setDecade(Number(e.target.value))}
          aria-label="Decade"
          className="w-full accent-current"
          style={{ color: "var(--tw-accent)" }}
        />
      </fieldset>

      <fieldset disabled={disabled} className="space-y-2">
        <legend className="block text-xs font-medium mb-1" style={{ color: "var(--tw-muted)" }}>
          Economic role
        </legend>
        <div className="grid grid-cols-1 gap-1.5">
          {ECONOMIC_ROLES.map((r) => (
            <label
              key={r}
              className="flex items-center gap-2 text-sm rounded px-2 py-1.5 cursor-pointer"
              style={{
                backgroundColor: role === r ? "var(--tw-accent-dim)" : "transparent",
                color: "var(--tw-text)",
              }}
            >
              <input
                type="radio"
                name="economic-role"
                value={r}
                checked={role === r}
                onChange={() => setRole(r)}
              />
              {r}
            </label>
          ))}
        </div>
      </fieldset>

      <button
        type="submit"
        disabled={!canSubmit}
        className="w-full rounded py-2.5 text-sm font-semibold transition-opacity disabled:opacity-40"
        style={{ backgroundColor: "var(--tw-accent)", color: "var(--tw-surface)" }}
      >
        Submit guess
      </button>
    </form>
  );
}
