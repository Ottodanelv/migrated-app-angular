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

  return String.raw(messageParts, ...expressions);
}
