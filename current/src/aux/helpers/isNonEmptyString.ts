import { isString } from 'radashi'

export function isNonEmptyString(value: unknown): value is string {
  return isString(value) && Boolean(value)
}
