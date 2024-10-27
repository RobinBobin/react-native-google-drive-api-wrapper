import { GDriveApi } from '../GDriveApi'
import { Fetcher } from 'aux/Fetcher'
import { makePermissionsUri } from 'aux/uriMakers'
import { MimeType } from 'src/MimeType'
import type { TQueryParameters } from 'src/types'
import type { TJson } from 'src/types'

export class Permissions extends GDriveApi {
  create(fileId: string, requestBody: TJson, queryParameters?: TQueryParameters): Promise<TJson> {
    return new Fetcher(this)
      .setBody(JSON.stringify(requestBody), MimeType.JSON)
      .setMethod('POST')
      .fetchJson(makePermissionsUri({ fileId, queryParameters }))
  }

  delete(fileId: string, permissionId: string, queryParameters?: TQueryParameters): Promise<string> {
    return new Fetcher(this)
      .setMethod('DELETE')
      .fetchText(makePermissionsUri({ fileId, permissionId, queryParameters }))
  }
}
