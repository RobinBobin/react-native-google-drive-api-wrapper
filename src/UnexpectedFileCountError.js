export default class UnexpectedFileCountError extends Error {
  constructor(expectedCount, realCount) {
    super();
    
    this.__expectedCount = expectedCount;
    this.__realCount = realCount;
  }
  
  get expectedCount() {
    return this.__expectedCount;
  }
  
  get realCount() {
    return this.__realCount;
  }
  
  toString() {
    const expected = Array.isArray(this.expectedCount) ? `[${this.expectedCount}]` : this.expectedCount;
    
    return `UnexpectedFileCountError: expected ${expected}, got ${this.realCount}`;
  }
};
