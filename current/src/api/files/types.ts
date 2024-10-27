import type { TQueryParameters } from 'src/types'
import type { ListQueryBuilder } from './ListQueryBuilder'

export interface ICreateGetFetcherParams {
  fileId: string
  isContent?: boolean
  queryParameters: TQueryParameters | undefined
  range?: string | undefined
}

export interface ICreateIfNotExistsResultType<ExecuteResultType> {
  alreadyExisted: boolean
  result: ExecuteResultType
}

export type TListParams = TQueryParameters & { q: string | typeof ListQueryBuilder}