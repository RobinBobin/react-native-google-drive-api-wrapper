import type { IterableElement, ReadonlyDeep } from 'type-fest'
import type { IUriParameters } from './types'

export const makeUri = ({
  api,
  fileId,
  path,
  preDrivePath,
  queryParameters = {}
}: ReadonlyDeep<IUriParameters>): string => {
  const uri = [
    'https://www.googleapis.com',
    preDrivePath,
    'drive/v3',
    api,
    fileId,
    path
  ]
    .filter(Boolean)
    .join('/')

  const url = new URL(uri)

  const entries = Object.entries(queryParameters)

  entries.forEach(([key, value]: Readonly<IterableElement<typeof entries>>) => {
    url.searchParams.append(key, value?.toString() ?? typeof undefined)
  })

  return url.toString()
}
