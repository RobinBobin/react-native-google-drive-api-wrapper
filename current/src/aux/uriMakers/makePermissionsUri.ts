import type { ReadonlyDeep } from 'type-fest'
import type { IPermissionsParameters } from './types'

import { makeUri } from './makeUri'

export const makePermissionsUri = ({
  fileId,
  permissionId,
  queryParameters
}: ReadonlyDeep<IPermissionsParameters>): string => {
  const path = ['permissions', permissionId].filter(Boolean).join('/')

  return makeUri({
    api: 'files',
    fileId,
    path,
    queryParameters
  })
}
