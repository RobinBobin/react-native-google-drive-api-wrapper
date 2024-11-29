class UnexpectedFileCountError extends Error {
  constructor(readonly realCount: number) {
    super(`Zero or one file was expected, got ${realCount}`)
  }
}

UnexpectedFileCountError.prototype.name = 'UnexpectedFileCountError'

export { UnexpectedFileCountError }
