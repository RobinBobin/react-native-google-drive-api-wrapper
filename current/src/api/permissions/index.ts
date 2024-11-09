import type { ReadonlyDeep } from 'type-fest'
import type {
  IPermissionInput,
  IPermissionOutput,
  IPermissionsCreateQueryParameters,
  IPermissionsDeleteQueryParameters
} from './types'

import { Fetcher } from '../../aux/Fetcher'
import { PermissionsUriBuilder } from '../../aux/uriBuilders/permissions/PermissionsUriBuilder'
import { MIME_TYPE_JSON } from '../../constants'
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
      .fetchJson(new PermissionsUriBuilder(fileId).build({ queryParameters }))
  }

  async delete(
    fileId: string,
    permissionId: string,
    queryParameters?: ReadonlyDeep<IPermissionsDeleteQueryParameters>
  ): Promise<void> {
    await new Fetcher(this).setMethod('DELETE').fetchText(
      new PermissionsUriBuilder(fileId, permissionId).build({
        queryParameters
      })
    )
  }
}
