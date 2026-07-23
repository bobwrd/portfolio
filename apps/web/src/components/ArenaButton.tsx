import { Link } from "react-router-dom";
import { Swords } from "lucide-react";

export default function ArenaButton() {
  return (
    <Link
      to="/mini/arena"
      className="inline-flex items-center gap-1.5 rounded-md border border-rose-500/30 bg-rose-500/8 px-2.5 py-1 text-xs font-medium text-rose-700 dark:text-rose-400 hover:bg-rose-500/15 hover:border-rose-500/50 transition-colors duration-150 whitespace-nowrap"
      title="The Arena — competition and efficiency"
    >
      <Swords className="size-3.5" />
      The Arena
    </Link>
  );
}
