import type { ReadonlyDeep } from 'type-fest'
import type {
  IPermissionInput,
  IPermissionOutput,
  IPermissionsCreateQueryParameters,
  IPermissionsDeleteQueryParameters
} from './types'

import { mimeTypes } from '@robinbobin/mimetype-constants'

import { Fetcher } from '../../aux/Fetcher'
import { PermissionsUriBuilder } from '../../aux/uriBuilders/permissions/PermissionsUriBuilder'
import { GDriveApi } from '../GDriveApi'

export class PermissionApi extends GDriveApi {
  create(
    fileId: string,
    requestBody: Readonly<IPermissionInput>,
    queryParameters?: ReadonlyDeep<IPermissionsCreateQueryParameters>
  ): Promise<IPermissionOutput> {
    return new Fetcher(this)
      .setBody(JSON.stringify(requestBody), mimeTypes.application.json)
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
