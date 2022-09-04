type ExpectedCount = number[] | number

export default class UnexpectedFileCountError extends Error {
  __expectedCount: ExpectedCount
  __realCount: number

  constructor(expectedCount: ExpectedCount, realCount: number) {
    super()

    this.__expectedCount = expectedCount
    this.__realCount = realCount

    const expected = Array.isArray(this.expectedCount)
      ? `[${this.expectedCount}]`
      : this.expectedCount

    this.message = `expected ${expected}, got ${this.realCount}`
  }

  get expectedCount() {
    return this.__expectedCount
  }

  get realCount() {
    return this.__realCount
  }
}

UnexpectedFileCountError.prototype.name = 'UnexpectedFileCountError'
