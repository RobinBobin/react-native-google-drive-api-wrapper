export class ResumableUploaderError extends Error {
  constructor(
    message: string,
    readonly response: Response
  ) {
    super(message)
  }
}

ResumableUploaderError.prototype.name = 'ResumableUploaderError'
