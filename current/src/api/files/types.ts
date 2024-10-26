import type { TGenericQueryParameters } from '../aux/Uris/types'
import type { ListQueryBuilder } from './ListQueryBuilder'

export interface ICreateIfNotExistsResultType<ExecuteResultType> {
  alreadyExisted: boolean
  result: ExecuteResultType
}

export type TListParams = TGenericQueryParameters & { q: string | typeof ListQueryBuilder}