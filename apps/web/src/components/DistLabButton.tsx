import { Link } from "react-router-dom";
import { Scale } from "lucide-react";

export default function DistLabButton() {
  return (
    <Link
      to="/mini/lab"
      className="inline-flex items-center gap-1.5 rounded-md border border-amber-500/30 bg-amber-500/8 px-2.5 py-1 text-xs font-medium text-amber-700 dark:text-amber-400 hover:bg-amber-500/15 hover:border-amber-500/50 transition-colors duration-150 whitespace-nowrap"
      title="The Distribution Lab — inequality, mobility and wellbeing"
    >
      <Scale className="size-3.5" />
      The Distribution Lab
    </Link>
  );
}
