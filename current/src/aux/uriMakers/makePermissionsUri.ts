import type { ReadonlyDeep } from 'type-fest'
import type { IPermissionsParameters } from './types'

import { isNonEmptyString } from '../isNonEmptyString'
import { makeUri } from './makeUri'

export const makePermissionsUri = ({
  fileId,
  permissionId,
  queryParameters
}: ReadonlyDeep<IPermissionsParameters>): string => {
  const path = ['permissions', permissionId].filter(isNonEmptyString).join('/')

  return makeUri({
    api: 'files',
    fileId,
    path,
    queryParameters
  })
}
