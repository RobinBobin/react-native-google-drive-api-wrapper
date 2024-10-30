import type { TJson, TQueryParameters } from 'src/types'
import type { ReadonlyDeep } from 'type-fest'

import { GDriveApi } from 'api/GDriveApi'
import { fetchJson } from 'aux/Fetcher'
import { makeAboutUri } from 'aux/uriMakers'

export class About extends GDriveApi {
  get(
    queryParametersOrFields: ReadonlyDeep<TQueryParameters> | string
  ): Promise<TJson> {
    const queryParameters =
      typeof queryParametersOrFields === 'object' ?
        queryParametersOrFields
      : { fields: queryParametersOrFields }

    return fetchJson(this, makeAboutUri({ queryParameters }))
  }
}
