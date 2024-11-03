/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */

import type { JsonValue } from 'type-fest'

type TKey = string
type TValue = JsonValue
type TValueQuotationFlag = boolean
type TKeyOrValue = TKey | TValue

type TClauseFunctionCommand = 'and' | 'or' | 'push'
type TKeyValueOperator = 'contains' | '=' | '>' | '<'
type TValueKeyOperator = 'in'

type TClause =
  | [TKey, TKeyValueOperator, TValue, TValueQuotationFlag?]
  | [TValue, TValueKeyOperator, TKey, TValueQuotationFlag?]

type TClauseFunctionParameterType<TIsOptional extends boolean = true> =
  TIsOptional extends true ? TClause | never[] : TClause

interface IListQueryBuilder {
  and: (...clause: TClauseFunctionParameterType) => IListQueryBuilder
  or: (...clause: TClauseFunctionParameterType) => IListQueryBuilder
  pop: () => IListQueryBuilder
  push: (...clause: TClauseFunctionParameterType) => IListQueryBuilder
  toString: () => string
}

export type {
  IListQueryBuilder,
  TClauseFunctionCommand,
  TClauseFunctionParameterType,
  TKeyOrValue
}
