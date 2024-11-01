import type { TStandardParameters } from 'api/types'
import type { IMakeAboutUriParameters } from 'aux/uriMakers/types'
import type { JsonObject, ReadonlyDeep } from 'type-fest'
import type { IAboutGetResultType, TAboutGetQueryParameters } from './types'

import { GDriveApi } from 'api/GDriveApi'
import { fetchJson } from 'aux/Fetcher'
import { makeAboutUri } from 'aux/uriMakers'

const prepareMakeAboutUriParameters = (
  queryParameters: ReadonlyDeep<TAboutGetQueryParameters>
): IMakeAboutUriParameters => {
  const isArray = Array.isArray(queryParameters)
  const isObject = typeof queryParameters === 'object' && !isArray

  if (isObject) {
    return { queryParameters: queryParameters as JsonObject }
  }

  const standardParameters: TStandardParameters = {
    fields: isArray ? queryParameters.join() : queryParameters
  }

  return { queryParameters: standardParameters }
}

export class About extends GDriveApi {
  get(
    queryParameters: ReadonlyDeep<TAboutGetQueryParameters>
  ): Promise<IAboutGetResultType> {
    return fetchJson(
      this,
      makeAboutUri(prepareMakeAboutUriParameters(queryParameters))
    )
  }
}
