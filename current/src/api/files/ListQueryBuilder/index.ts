import type { IListQueryBuilder, TClauseFunction, TKeyOrValue } from './types'

const factory = (): IListQueryBuilder => {
  const queryClauses: TKeyOrValue[] = []
  queryClauses.toString()
  const listQueryBuilder: Partial<IListQueryBuilder> = {}

  const addClause: TClauseFunction<true> = (
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    ...[keyOrValue1, operator, keyOrValue2, valueQuotationFlag = true]
  ) => {
    const isIn = operator === 'in'
    const key = isIn ? keyOrValue2 : keyOrValue1
    const rawValue = isIn ? keyOrValue1 : keyOrValue2
    const shouldQuotateValue =
      typeof rawValue === 'string' && valueQuotationFlag
    const value = shouldQuotateValue ? `'${rawValue}'` : rawValue

    queryClauses.push(isIn ? value : key)
    queryClauses.push(operator)
    queryClauses.push(isIn ? key : value)

    return listQueryBuilder
  }

  const target: TClauseFunction<true> = addClause
  target.toString()

  const source: Pick<IListQueryBuilder, 'pop'> = {}

  return listQueryBuilder as IListQueryBuilder

  // function clauseFunction(
  //   command: TClauseFunctionCommand,
  //   ...rest: unknown[]
  // ): TListQueryBuilder {
  //   queryClauses.push(command === 'push' ? '(' : command)

  //   return rest.length ? addClause(...(rest as TClause)) : implementation
  // }

  // const source: IListQueryBuilderSource = {
  //   and(...clause: unknown[]) {
  //     return clauseFunction('and', ...clause)
  //   },
  //   or(...clause: unknown[]) {
  //     return clauseFunction('or', ...clause)
  //   },
  //   pop() {
  //     queryClauses.push(')')

  //     return implementation
  //   },
  //   push(...clause) {
  //     return clauseFunction('push', ...clause)
  //   },
  //   toString() {
  //     const query = queryClauses.join(' ')

  //     queryClauses.length = 0

  //     return query
  //   }
  // }

  //
}

export const ListQueryBuilder = factory()
