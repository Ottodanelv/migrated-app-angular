declare global {
  interface GlobalThis {
    $localize?: (messageParts: TemplateStringsArray, ...expressions: readonly unknown[]) => string;
  }
}

export {};
