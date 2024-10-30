import type { ReadonlyDeep } from 'type-fest'

class ResumableUploaderError extends Error {
  constructor(
    message: string,
    readonly response: ReadonlyDeep<Response>
  ) {
    super(message)
  }
}

ResumableUploaderError.prototype.name = 'ResumableUploaderError'

export { ResumableUploaderError }
