import { ECONOMIC_ROLES, type EconomicRole } from "./types.js";

export { ECONOMIC_ROLES };

/**
 * Low → high captured margin, used only to derive the "undervalued" /
 * "overvalued" nudge when a role guess is wrong. Judgment call, not a
 * historical constant: a source producer sells near production cost: a
 * colonial extractor still acquires goods cheaply (by coercion, not market
 * price) so it sits just above; an entrepot/middleman captures a trading
 * spread; a re-export hub adds a further markup on top of that; an end
 * consumer market pays the final, highest retail price in the chain.
 */
export const ROLE_MARGIN_ORDER: EconomicRole[] = [
  "Source producer",
  "Colonial extractor",
  "Entrepôt / middleman",
  "Re-export hub",
  "End consumer market",
];

export function roleMarginIndex(role: EconomicRole): number {
  return ROLE_MARGIN_ORDER.indexOf(role);
}
