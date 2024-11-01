import type { JsonObject } from 'type-fest'
import type { ListQueryBuilder } from './ListQueryBuilder'

interface ICreateGetFetcherParams {
  fileId: string
  isContent?: boolean
  queryParameters: JsonObject | undefined
  range?: string | undefined
}

interface ICreateIfNotExistsResultType<ExecuteResultType> {
  alreadyExisted: boolean
  result: ExecuteResultType
}

type TListParams = JsonObject &
  Readonly<{
    q?: string | Readonly<typeof ListQueryBuilder>
  }>

export type {
  ICreateGetFetcherParams,
  ICreateIfNotExistsResultType,
  TListParams
}
