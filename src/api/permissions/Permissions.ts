import { GDriveApi } from '../GDriveApi'
import { Fetcher } from '../aux/Fetcher'
import { Uris } from '../aux/Uris'
import { MimeType } from '../../MimeType'

export class Permissions extends GDriveApi {
  create(fileId: string, requestBody: object, queryParameters?: object) {
    return new Fetcher(this)
      .setBody(JSON.stringify(requestBody), MimeType.JSON)
      .setMethod('POST')
      .fetch(Uris.permissions({ fileId, queryParameters }), 'json')
  }

  delete(fileId: string, permissionId: string, queryParameters?: object) {
    return new Fetcher(this)
      .setMethod('DELETE')
      .fetch(Uris.permissions({ fileId, permissionId, queryParameters }), 'text')
  }
}
