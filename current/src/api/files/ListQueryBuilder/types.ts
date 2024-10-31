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

interface IListQueryBuilder {
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  (...clause: TClause): IListQueryBuilder
  pop: () => IListQueryBuilder
}

type TClauseFunction<TIsPartial extends boolean = false> = (
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  ...clause: TClause
) => TIsPartial extends true ? Partial<IListQueryBuilder> : IListQueryBuilder

interface IListQueryBuilder
  extends Record<TClauseFunctionCommand, TClauseFunction> {
  toString: () => string
}

export type { IListQueryBuilder, TClauseFunction, TKeyOrValue }
