export function isMockedApiRequest(
  requestUrl: string,
  apiBaseUrl: string,
  origin: string,
): boolean {
  const resolvedApiBaseUrl = new URL(apiBaseUrl, origin);
  const resolvedRequestUrl = new URL(requestUrl, origin);

  return (
    resolvedRequestUrl.origin === resolvedApiBaseUrl.origin &&
    resolvedRequestUrl.pathname.startsWith(resolvedApiBaseUrl.pathname)
  );
}
