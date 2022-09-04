import GDriveApi from '../GDriveApi'
import Fetcher from '../aux/Fetcher'
import Uris from '../aux/Uris'
import MimeTypes from '../../MimeTypes'

export default class Permissions extends GDriveApi {
  create(fileId: string, queryParameters: object | undefined, requestBody: object) {
    return new Fetcher(this)
      .setBody(JSON.stringify(requestBody), MimeTypes.JSON)
      .setMethod('POST')
      .fetch(Uris.permissions({ fileId, queryParameters }), 'json')
  }

  delete(fileId: string, permissionId: string, queryParameters?: object) {
    return new Fetcher(this)
      .setMethod('DELETE')
      .fetch(Uris.permissions({ fileId, permissionId, queryParameters }), 'text')
  }
}
