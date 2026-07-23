import { Link } from "react-router-dom";
import { Gavel } from "lucide-react";

export default function LedgerButton() {
  return (
    <Link
      to="/mini/ledger"
      className="inline-flex items-center gap-1.5 rounded-md border border-amber-600/30 bg-amber-600/8 px-2.5 py-1 text-xs font-medium text-amber-700 dark:text-amber-500 hover:bg-amber-600/15 hover:border-amber-600/50 transition-colors duration-150 whitespace-nowrap"
      title="The Ledger — MAS enforcement actions database"
    >
      <Gavel className="size-3.5" />
      The Ledger
    </Link>
  );
}
