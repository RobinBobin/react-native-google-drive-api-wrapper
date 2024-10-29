import type { IFilesParameters } from './types'

import { makeUri } from './makeUri'

export const makeFilesUri = ({
  fileId,
  method,
  preDrivePath,
  queryParameters
}: IFilesParameters): string => {
  return makeUri({
    api: 'files',
    fileId,
    path: method,
    preDrivePath,
    queryParameters
  })
}
