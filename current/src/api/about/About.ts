import { GDriveApi } from '../GDriveApi'
import { fetch } from '../aux/Fetcher'
import { Uris } from '../aux/Uris'
import type { TGenericQueryParameters } from '../aux/Uris/types'

export class About extends GDriveApi {
  get(queryParametersOrFields: TGenericQueryParameters | string) {
    const queryParameters =
      typeof queryParametersOrFields === 'object'
        ? queryParametersOrFields
        : { fields: queryParametersOrFields }

    return fetch(this, Uris.about({ queryParameters }), 'json')
  }
}
