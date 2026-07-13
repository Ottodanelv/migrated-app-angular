export function isMockedApiRequest(
  requestUrl: string,
  apiBaseUrl: string,
  origin: string,
): boolean {
  const resolvedApiBaseUrl = new URL(apiBaseUrl, origin);
  const resolvedRequestUrl = new URL(requestUrl, origin);
  const apiPathname = resolvedApiBaseUrl.pathname.endsWith('/')
    ? resolvedApiBaseUrl.pathname.slice(0, -1)
    : resolvedApiBaseUrl.pathname;

  return (
    resolvedRequestUrl.origin === resolvedApiBaseUrl.origin &&
    (resolvedRequestUrl.pathname === apiPathname ||
      resolvedRequestUrl.pathname.startsWith(`${apiPathname}/`))
  );
}
