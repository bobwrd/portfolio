import { Link } from "react-router-dom";
import { Telescope } from "lucide-react";

export default function ObservatoryButton() {
  return (
    <Link
      to="/mini/observatory"
      className="inline-flex items-center gap-1.5 rounded-md border border-teal-600/30 bg-teal-600/8 px-2.5 py-1 text-xs font-medium text-teal-700 dark:text-teal-400 hover:bg-teal-600/15 hover:border-teal-600/50 transition-colors duration-150 whitespace-nowrap"
      title="The Observatory — AI, productivity and prices"
    >
      <Telescope className="size-3.5" />
      The Observatory
    </Link>
  );
}
