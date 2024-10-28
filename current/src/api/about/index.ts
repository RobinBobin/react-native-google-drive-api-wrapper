import type { TJson } from 'src/types'
import { GDriveApi } from '../GDriveApi'
import { fetchJson } from 'aux/Fetcher'
import { makeAboutUri } from 'aux/uriMakers'
import type { TQueryParameters } from 'src/types'

export class About extends GDriveApi {
  get(queryParametersOrFields: TQueryParameters | string): Promise<TJson> {
    const queryParameters =
      typeof queryParametersOrFields === 'object' ?
        queryParametersOrFields
      : { fields: queryParametersOrFields }

    return fetchJson(this, makeAboutUri({ queryParameters }))
  }
}
