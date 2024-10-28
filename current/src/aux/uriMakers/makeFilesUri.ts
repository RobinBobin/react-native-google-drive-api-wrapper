import { makeUri } from './makeUri'
import type { IFilesParameters } from './types'

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
