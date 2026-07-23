/**
 * OneBook's internal nav (`Sidebar`, page-level `navigate()` calls) uses
 * absolute paths like "/history" and "/settings". Those need an "/onebook"
 * prefix when this app is embedded in the unified site's single router, but
 * not when `App` runs standalone (its own tests mount it at the real root).
 *
 * Detecting embedding at runtime from the current URL — rather than a build
 * flag — is what lets `OnebookApp` and the standalone `App` share one set of
 * components unmodified.
 */
export function onebookPath(path: string): string {
  return window.location.pathname.startsWith("/onebook")
    ? `/onebook${path}`
    : path;
}
