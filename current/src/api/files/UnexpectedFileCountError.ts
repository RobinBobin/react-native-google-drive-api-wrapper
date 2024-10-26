type TExpectedCount = number[] | number

export class UnexpectedFileCountError extends Error {
  constructor(
    readonly expectedCount: TExpectedCount,
    readonly realCount: number
  ) {
    super()

    const expected = Array.isArray(this.expectedCount)
      ? `[${this.expectedCount}]`
      : this.expectedCount

    this.message = `expected ${expected}, got ${this.realCount}`
  }
}

UnexpectedFileCountError.prototype.name = 'UnexpectedFileCountError'
