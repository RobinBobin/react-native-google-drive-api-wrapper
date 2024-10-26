import type { IAboutParameters, IFilesParameters, IPermissionsParameters, IUriParameters } from './types'
import { isNonEmptyString } from '../utils'

export class Uris {
  static about({ queryParameters }: IAboutParameters) {
    return Uris.__makeUri({ api: 'about', queryParameters })
  }

  static files({ fileId, method, preDrivePath, queryParameters }: IFilesParameters) {
    return Uris.__makeUri({
      api: 'files',
      fileId,
      path: method,
      preDrivePath,
      queryParameters,
    })
  }

  static permissions({ fileId, permissionId, queryParameters }: IPermissionsParameters) {
    const path = ['permissions', permissionId].filter(isNonEmptyString).join('/')

    return Uris.__makeUri({
      api: 'files',
      fileId,
      path,
      queryParameters,
    })
  }

  static __makeUri({
    api,
    fileId,
    path,
    preDrivePath,
    queryParameters = {},
  }: IUriParameters): string {
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
}
