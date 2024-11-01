import type { ReadonlyDeep } from 'type-fest'
import type {
  IPermissionInput,
  IPermissionOutput,
  IPermissionsCreateQueryParameters,
  IPermissionsDeleteQueryParameters
} from './types'

import { Fetcher } from 'aux/Fetcher'
import { makePermissionsUri } from 'aux/uriMakers'
import { MIME_TYPE_JSON } from 'src/constants'

import { GDriveApi } from '../GDriveApi'

export class PermissionApi extends GDriveApi {
  create(
    fileId: string,
    requestBody: Readonly<IPermissionInput>,
    queryParameters?: ReadonlyDeep<IPermissionsCreateQueryParameters>
  ): Promise<IPermissionOutput> {
    return new Fetcher(this)
      .setBody(JSON.stringify(requestBody), MIME_TYPE_JSON)
      .setMethod('POST')
      .fetchJson(makePermissionsUri({ fileId, queryParameters }))
  }

  async delete(
    fileId: string,
    permissionId: string,
    queryParameters?: ReadonlyDeep<IPermissionsDeleteQueryParameters>
  ): Promise<void> {
    await new Fetcher(this)
      .setMethod('DELETE')
      .fetchText(makePermissionsUri({ fileId, permissionId, queryParameters }))
  }
}
