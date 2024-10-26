type TKey = string
type TValue = boolean | number | string
type TValueQuotationFlag = boolean

type TClauseFunctionWithoutClause = () => TListQueryBuilder

type TClauseFunction<T extends TClauseFunctionCommand> = T extends 'push' ? TClauseFunctionWithClause : TClauseFunctionWithClause | TClauseFunctionWithoutClause

type TOperator = 'contains' | '=' | '>' | '<'

export type TClause = [TKey, TOperator, TValue, TValueQuotationFlag?] | [TValue, 'in', TKey, TValueQuotationFlag?]
export type TClauseFunctionCommand = 'and' | 'or' | 'push'
export type TClauseFunctionWithClause = (...clause: TClause) => TListQueryBuilder
export type TKeyOrValue = TKey | TValue

export interface IListQueryBuilderSource extends Record<TClauseFunctionCommand, TClauseFunction<TClauseFunctionCommand>> {
  pop(): TListQueryBuilder
  toString(): string
}

export interface IListQueryBuilderTarget {
  (...clause: TClause): TListQueryBuilder
}

export type TListQueryBuilder = IListQueryBuilderSource & IListQueryBuilderTarget
