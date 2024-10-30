/* eslint-disable import-x/group-exports */
 

type TKey = string
type TValue = boolean | number | string
type TValueQuotationFlag = boolean

type TClauseFunctionWithoutClause = () => TListQueryBuilder

type TClauseFunction<T extends TClauseFunctionCommand> =
  T extends 'push' ? TClauseFunctionWithClause
  : TClauseFunctionWithClause | TClauseFunctionWithoutClause

type TOperator = 'contains' | '=' | '>' | '<'

export type TClause =
  | [TKey, TOperator, TValue, TValueQuotationFlag?]
  | [TValue, 'in', TKey, TValueQuotationFlag?]
export type TClauseFunctionCommand = 'and' | 'or' | 'push'
export type TClauseFunctionWithClause = (
  ...clause: TClause
) => TListQueryBuilder
export type TKeyOrValue = TKey | TValue

export interface IListQueryBuilderSource {
  and: () => TClauseFunction<'and'>
  or: () => TClauseFunction<'or'>
  pop: () => TListQueryBuilder
  push: () => TClauseFunction<'push'>
  toString: () => string
}

export type TListQueryBuilderTarget = (...clause: TClause) => TListQueryBuilder

export type TListQueryBuilder = IListQueryBuilderSource &
  TListQueryBuilderTarget
