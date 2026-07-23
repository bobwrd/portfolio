import { Link } from "react-router-dom";
import { Gavel } from "lucide-react";

export default function DocketButton() {
  return (
    <Link
      to="/mini/docket"
      className="inline-flex items-center gap-1.5 rounded-md border border-emerald-500/30 bg-emerald-500/8 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/15 hover:border-emerald-500/50 transition-colors duration-150 whitespace-nowrap"
      title="The Docket — Indian court backlogs"
    >
      <Gavel className="size-3.5" />
      The Docket
    </Link>
  );
}
