export function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && Boolean(value)
}
