import type { TJson, TQueryParameters } from 'src/types'

import { Fetcher } from 'aux/Fetcher'
import { makePermissionsUri } from 'aux/uriMakers'
import { MIME_TYPE_JSON } from 'src/constants'

import { GDriveApi } from '../GDriveApi'

export class PermissionApi extends GDriveApi {
  create(
    fileId: string,
    requestBody: TJson,
    queryParameters?: TQueryParameters
  ): Promise<TJson> {
    return new Fetcher(this)
      .setBody(JSON.stringify(requestBody), MIME_TYPE_JSON)
      .setMethod('POST')
      .fetchJson(makePermissionsUri({ fileId, queryParameters }))
  }

  delete(
    fileId: string,
    permissionId: string,
    queryParameters?: TQueryParameters
  ): Promise<string> {
    return new Fetcher(this)
      .setMethod('DELETE')
      .fetchText(makePermissionsUri({ fileId, permissionId, queryParameters }))
  }
}
