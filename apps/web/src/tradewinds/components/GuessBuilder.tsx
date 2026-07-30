import { useEffect, useState } from "react";
import {
  ECONOMIC_ROLES,
  findEra,
  findPort,
  type EconomicRole,
  type Guess,
  type Port,
} from "@portfolio/tradewinds";
import PortPicker, { LockedBadge, PortDatalist } from "./PortPicker";
import EraPicker from "./EraPicker";
import type { Locks } from "../lib/locks";

interface GuessBuilderProps {
  ports: Port[];
  disabled: boolean;
  locks: Locks;
  onSubmit: (guess: Guess) => void;
}

export default function GuessBuilder({ ports, disabled, locks, onSubmit }: GuessBuilderProps) {
  const [originQuery, setOriginQuery] = useState("");
  const [destQuery, setDestQuery] = useState("");
  const [eraId, setEraId] = useState<string | null>(null);
  const [role, setRole] = useState<EconomicRole | null>(null);

  // A newly-earned lock pins its field to the solved value.
  useEffect(() => {
    if (locks.originPortId) setOriginQuery(findPort(ports, locks.originPortId)?.name ?? "");
  }, [locks.originPortId, ports]);

  useEffect(() => {
    if (locks.destinationPortId) setDestQuery(findPort(ports, locks.destinationPortId)?.name ?? "");
  }, [locks.destinationPortId, ports]);

  useEffect(() => {
    if (locks.eraId) setEraId(locks.eraId);
  }, [locks.eraId]);

  useEffect(() => {
    if (locks.economicRole) setRole(locks.economicRole);
  }, [locks.economicRole]);

  const originPort = ports.find((p) => p.name === originQuery);
  const destPort = ports.find((p) => p.name === destQuery);
  const era = eraId ? findEra(eraId) : undefined;
  const canSubmit = !disabled && !!originPort && !!destPort && !!era && !!role;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!originPort || !destPort || !era || !role) return;
    onSubmit({
      originPortId: originPort.id,
      destinationPortId: destPort.id,
      eraId: era.id,
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
          <PortPicker
            label="Origin"
            query={originQuery}
            onChange={setOriginQuery}
            locked={!!locks.originPortId}
          />
          <PortPicker
            label="Destination"
            query={destQuery}
            onChange={setDestQuery}
            locked={!!locks.destinationPortId}
          />
        </div>
      </fieldset>

      <fieldset disabled={disabled}>
        <legend className="flex items-center gap-1.5 text-xs font-medium mb-1.5" style={{ color: "var(--tw-muted)" }}>
          Era
          {locks.eraId && <LockedBadge />}
        </legend>
        <EraPicker value={eraId} onChange={setEraId} disabled={!!locks.eraId} />
      </fieldset>

      <fieldset disabled={disabled} className="space-y-2">
        <legend className="flex items-center gap-1.5 text-xs font-medium mb-1" style={{ color: "var(--tw-muted)" }}>
          Economic role
          {locks.economicRole && <LockedBadge />}
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
                disabled={!!locks.economicRole}
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
