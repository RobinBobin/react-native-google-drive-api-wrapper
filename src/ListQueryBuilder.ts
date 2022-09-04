import { StaticUtils } from 'simple-common-utils'

type Key = string
type Value = boolean | number | string
type KeyOrValue = Key | Value

export default class ListQueryBuilder {
  __query: Array<KeyOrValue> = []

  and() {
    return this.__push('and')
  }

  contains(key: Key, value: Value, quoteValueIfString: boolean = true) {
    return this.operator(key, 'contains', value, false, quoteValueIfString)
  }

  e(key: Key, value: Value, quoteValueIfString: boolean = true) {
    return this.operator(key, '=', value, false, quoteValueIfString)
  }

  g(key: Key, value: Value, quoteValueIfString: boolean = true) {
    return this.operator(key, '>', value, false, quoteValueIfString)
  }

  in(value: Value, key: Key, quoteValueIfString: boolean = true) {
    return this.operator(value, 'in', key, quoteValueIfString, false)
  }

  l(key: Key, value: Value, quoteValueIfString: boolean = true) {
    return this.operator(key, '<', value, false, quoteValueIfString)
  }

  operator(
    left: KeyOrValue,
    operator: string,
    right: KeyOrValue,
    quoteLeftIfString: boolean,
    quoteRightIfString: boolean,
  ) {
    this.__query.push(StaticUtils.safeQuoteIfString(left, quoteLeftIfString, "'"))
    this.__query.push(operator)
    this.__query.push(StaticUtils.safeQuoteIfString(right, quoteRightIfString, "'"))

    return this
  }

  or() {
    return this.__push('or')
  }

  pop() {
    return this.__push(')')
  }

  push() {
    return this.__push('(')
  }

  toString() {
    return this.__query.join(' ')
  }

  __push(entity: KeyOrValue) {
    this.__query.push(entity)

    return this
  }
}
