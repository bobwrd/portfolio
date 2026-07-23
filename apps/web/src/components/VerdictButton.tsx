import { Link } from "react-router-dom";
import { Scale } from "lucide-react";

export default function VerdictButton() {
  return (
    <Link
      to="/mini/verdict"
      className="inline-flex items-center gap-1.5 rounded-md border border-cyan-500/30 bg-cyan-500/8 px-2.5 py-1 text-xs font-medium text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/15 hover:border-cyan-500/50 transition-colors duration-150 whitespace-nowrap"
      title="The Verdict — AI policy intelligence database"
    >
      <Scale className="size-3.5" />
      The Verdict
    </Link>
  );
}
