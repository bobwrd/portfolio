import type { EconomicRole } from "@portfolio/tradewinds";
import type { StoredGuess } from "./storage";

/**
 * Any component graded green stays solved: it is pre-filled and frozen on
 * every later guess. This costs no information (the player already knows the
 * value) but stops them re-specifying — and accidentally losing — an answer
 * they've earned.
 */
export interface Locks {
  originPortId: string | null;
  destinationPortId: string | null;
  eraId: string | null;
  economicRole: EconomicRole | null;
}

export const NO_LOCKS: Locks = {
  originPortId: null,
  destinationPortId: null,
  eraId: null,
  economicRole: null,
};

export function deriveLocks(history: StoredGuess[]): Locks {
  return history.reduce<Locks>((locks, { guess, feedback }) => {
    return {
      originPortId:
        feedback.route.origin.level === "green" ? guess.originPortId : locks.originPortId,
      destinationPortId:
        feedback.route.destination.level === "green"
          ? guess.destinationPortId
          : locks.destinationPortId,
      eraId: feedback.era.level === "green" ? guess.eraId : locks.eraId,
      economicRole: feedback.role.level === "green" ? guess.economicRole : locks.economicRole,
    };
  }, NO_LOCKS);
}

export function lockedCount(locks: Locks): number {
  return Object.values(locks).filter(Boolean).length;
}
