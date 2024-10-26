import { GDriveApi } from '../GDriveApi'
import { Fetcher } from '../aux/Fetcher'
import { Uris } from '../aux/Uris'
import { MimeType } from '../../MimeType'
import type { TGenericQueryParameters } from '../aux/Uris/types'

export class Permissions extends GDriveApi {
  create(fileId: string, requestBody: Record<string, unknown>, queryParameters?: TGenericQueryParameters) {
    return new Fetcher(this)
      .setBody(JSON.stringify(requestBody), MimeType.JSON)
      .setMethod('POST')
      .fetch(Uris.permissions({ fileId, queryParameters }), 'json')
  }

  delete(fileId: string, permissionId: string, queryParameters?: TGenericQueryParameters) {
    return new Fetcher(this)
      .setMethod('DELETE')
      .fetch(Uris.permissions({ fileId, permissionId, queryParameters }), 'text')
  }
}
