export function logInfo(message: string, context?: Record<string, unknown>) {
  console.info(`[esimQ] ${message}`, context ?? {});
}

export function logError(message: string, error: unknown, context?: Record<string, unknown>) {
  console.error(`[esimQ] ${message}`, {
    error: error instanceof Error ? error.message : String(error),
    ...(context ?? {}),
  });
}
