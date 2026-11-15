import { useEffect } from "react";

const SITE = "Arin Jain";

/** Sets the tab title as "<page> — Arin Jain", or just the name on the home page. */
export function usePageTitle(page?: string | null) {
  useEffect(() => {
    document.title = page ? `${page} — ${SITE}` : SITE;
  }, [page]);
}
