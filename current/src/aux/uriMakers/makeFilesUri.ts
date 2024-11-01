import type { IMakeFilesUriParameters } from './types'

import { makeUri } from './makeUri'

export const makeFilesUri = ({
  fileId,
  method,
  preDrivePath,
  queryParameters
}: Readonly<IMakeFilesUriParameters>): string => {
  return makeUri({
    api: 'files',
    fileId,
    path: method,
    preDrivePath,
    queryParameters
  })
}
