import type { IMakePermissionsUriParameters } from './types'

import { makeUri } from './makeUri'

export const makePermissionsUri = ({
  fileId,
  permissionId,
  queryParameters
}: Readonly<IMakePermissionsUriParameters>): string => {
  const path = ['permissions', permissionId].filter(Boolean).join('/')

  return makeUri({
    api: 'files',
    fileId,
    path,
    queryParameters
  })
}
