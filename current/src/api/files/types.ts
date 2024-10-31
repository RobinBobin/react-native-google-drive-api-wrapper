import type { TQueryParameters } from 'src/types'
import type { ListQueryBuilder } from './ListQueryBuilder'

interface ICreateGetFetcherParams {
  fileId: string
  isContent?: boolean
  queryParameters: TQueryParameters | undefined
  range?: string | undefined
}

interface ICreateIfNotExistsResultType<ExecuteResultType> {
  alreadyExisted: boolean
  result: ExecuteResultType
}

type TListParams = TQueryParameters & {
  q?: string | Readonly<typeof ListQueryBuilder>
}

export type {
  ICreateGetFetcherParams,
  ICreateIfNotExistsResultType,
  TListParams
}
