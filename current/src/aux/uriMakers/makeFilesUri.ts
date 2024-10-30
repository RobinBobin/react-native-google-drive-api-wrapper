import type { ReadonlyDeep } from 'type-fest'
import type { IFilesParameters } from './types'

import { makeUri } from './makeUri'

export const makeFilesUri = ({
  fileId,
  method,
  preDrivePath,
  queryParameters
}: ReadonlyDeep<IFilesParameters>): string => {
  return makeUri({
    api: 'files',
    fileId,
    path: method,
    preDrivePath,
    queryParameters
  })
}
