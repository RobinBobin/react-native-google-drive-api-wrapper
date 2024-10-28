import { isNonEmptyString } from './isNonEmptyString'
import { makeUri } from './makeUri'
import type { IPermissionsParameters } from './types'

export const makePermissionsUri = ({
  fileId,
  permissionId,
  queryParameters
}: IPermissionsParameters): string => {
  const path = ['permissions', permissionId].filter(isNonEmptyString).join('/')

  return makeUri({
    api: 'files',
    fileId,
    path,
    queryParameters
  })
}
