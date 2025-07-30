/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */

import type {
  TClauseFunctionCommand,
  TClauseFunctionParameterType,
  TKeyOrValue
} from './types'

import { isString } from 'radashi'

export class ListQueryBuilder {
  private readonly queryClauses: TKeyOrValue[] = []

  constructor(...clause: TClauseFunctionParameterType<false>) {
    this.addClause(...clause)
  }

  and(...clause: TClauseFunctionParameterType): this {
    return this.clauseFunction('and', ...clause)
  }

  or(...clause: TClauseFunctionParameterType): this {
    return this.clauseFunction('or', ...clause)
  }

  pop(): this {
    this.queryClauses.push(')')

    return this
  }

  push(...clause: TClauseFunctionParameterType): this {
    return this.clauseFunction('push', ...clause)
  }

  toString(): string {
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    return this.queryClauses.join(' ')
  }

  private addClause(
    ...[
      keyOrValue1,
      operator,
      keyOrValue2,
      valueQuotationFlag = true
    ]: TClauseFunctionParameterType<false>
  ): this {
    const isIn = operator === 'in'
    const key = isIn ? keyOrValue2 : keyOrValue1
    const rawValue = isIn ? keyOrValue1 : keyOrValue2
    const shouldQuoteValue = isString(rawValue) && valueQuotationFlag
    const value = shouldQuoteValue ? `'${rawValue}'` : rawValue

    this.queryClauses.push(isIn ? value : key)
    this.queryClauses.push(operator)
    this.queryClauses.push(isIn ? key : value)

    return this
  }

  private clauseFunction(
    command: TClauseFunctionCommand,
    ...rest: readonly unknown[]
  ): this {
    this.queryClauses.push(command === 'push' ? '(' : command)

    return rest.length ?
        this.addClause(...(rest as TClauseFunctionParameterType<false>))
      : this
  }
}
