export function localize(
  messageParts: TemplateStringsArray,
  ...expressions: readonly unknown[]
): string {
  const globalLocalize = (globalThis as {
    $localize?: (messageParts: TemplateStringsArray, ...expressions: readonly unknown[]) => string;
  }).$localize;

  if (typeof globalLocalize === 'function') {
    return globalLocalize(messageParts, ...expressions);
  }

  const rawMessage = String.raw(messageParts, ...expressions);
  const metadataSeparator = rawMessage.lastIndexOf(':');

  return metadataSeparator > 0 ? rawMessage.slice(metadataSeparator + 1) : rawMessage;
}
