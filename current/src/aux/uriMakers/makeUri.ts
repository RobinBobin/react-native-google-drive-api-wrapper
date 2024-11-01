import type { IMakeUriParameters } from './types'

export const makeUri = ({
  api,
  fileId,
  path,
  preDrivePath,
  queryParameters = {}
}: Readonly<IMakeUriParameters>): string => {
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

  for (const [key, value] of Object.entries(queryParameters)) {
    url.searchParams.append(key, value?.toString() ?? 'null')
  }

  return url.toString()
}
