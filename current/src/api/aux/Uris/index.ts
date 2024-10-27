import type { IAboutParameters, IFilesParameters, IPermissionsParameters, IUriParameters } from './types'
import { isNonEmptyString } from '../utils'

const makeUri = ({
  api,
  fileId,
  path,
  preDrivePath,
  queryParameters = {},
}: IUriParameters): string => {
  const uri = ['https://www.googleapis.com']

  if (Array.isArray(preDrivePath)) {
    uri.push(...preDrivePath)
  } else if (preDrivePath) {
    uri.push(preDrivePath)
  }

  uri.push(...['drive/v3', api, fileId, path].filter(isNonEmptyString))

  const url = new URL(uri.join('/'))

  Object.entries(queryParameters).forEach(([key, value]) => url.searchParams.append(key, value?.toString() ?? typeof undefined))

  return url.toString()
}

export const makeAboutUri = ({ queryParameters }: IAboutParameters): string => {
  return makeUri({ api: 'about', queryParameters })
}

export const makeFilesUri = ({ fileId, method, preDrivePath, queryParameters }: IFilesParameters): string => {
  return makeUri({
    api: 'files',
    fileId,
    path: method,
    preDrivePath,
    queryParameters,
  })
}

export const makePermissionsUri = ({ fileId, permissionId, queryParameters }: IPermissionsParameters): string => {
  const path = ['permissions', permissionId].filter(isNonEmptyString).join('/')

  return makeUri({
    api: 'files',
    fileId,
    path,
    queryParameters,
  })
}
