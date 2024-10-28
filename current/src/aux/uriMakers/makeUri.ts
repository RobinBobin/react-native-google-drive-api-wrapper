import { isNonEmptyString } from './isNonEmptyString'
import type { IUriParameters } from './types'

export const makeUri = ({
  api,
  fileId,
  path,
  preDrivePath,
  queryParameters = {}
}: IUriParameters): string => {
  const uri = ['https://www.googleapis.com']

  if (Array.isArray(preDrivePath)) {
    uri.push(...preDrivePath)
  } else if (preDrivePath) {
    uri.push(preDrivePath)
  }

  uri.push(...['drive/v3', api, fileId, path].filter(isNonEmptyString))

  const url = new URL(uri.join('/'))

  Object.entries(queryParameters).forEach(([key, value]) =>
    url.searchParams.append(key, value?.toString() ?? typeof undefined)
  )

  return url.toString()
}
