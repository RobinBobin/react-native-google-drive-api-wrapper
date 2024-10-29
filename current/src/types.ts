type TJson = Record<string, unknown>
type TQueryParameters = Record<string, { toString: () => string } | undefined>

export type { TJson, TQueryParameters }
