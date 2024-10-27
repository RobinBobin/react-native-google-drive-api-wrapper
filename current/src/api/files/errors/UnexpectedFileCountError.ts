export class UnexpectedFileCountError extends Error {
  constructor(readonly realCount: number) {
    super(`expected zero or one file, got ${realCount}`)
  }
}

UnexpectedFileCountError.prototype.name = 'UnexpectedFileCountError'
