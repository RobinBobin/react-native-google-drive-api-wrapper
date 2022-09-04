import { ArrayStringifier } from 'simple-common-utils'
import { stringifyQueryParameters } from './utils'

interface AboutParameters {
  queryParameters: object
}

interface FilesParameters {
  fileId?: string
  method?: string
  preDrivePath?: PreDrivePath
  queryParameters?: object
}

interface PermissionsParameters {
  fileId: string
  permissionId?: string
  queryParameters: object
}

interface UriParameters {
  api: string
  fileId?: string | null
  path?: string | null
  preDrivePath?: PreDrivePath | null
  queryParameters?: object
}

type PreDrivePath = Array<string> | string

export default class Uris {
  static about({ queryParameters }: AboutParameters) {
    return Uris.__makeUri({ api: 'about', queryParameters })
  }

  static files({ fileId, method, preDrivePath, queryParameters }: FilesParameters) {
    return Uris.__makeUri({
      api: 'files',
      fileId,
      path: method,
      preDrivePath,
      queryParameters,
    })
  }

  static permissions({ fileId, permissionId, queryParameters }: PermissionsParameters) {
    const path = ['permissions']

    if (permissionId) {
      path.push(permissionId)
    }

    return Uris.__makeUri({
      api: 'files',
      fileId,
      path: path.join('/'),
      queryParameters,
    })
  }

  static __makeUri({
    api,
    fileId = null,
    path = null,
    preDrivePath = null,
    queryParameters = {},
  }: UriParameters): string {
    const uri = ['https://www.googleapis.com']

    if (Array.isArray(preDrivePath)) {
      uri.push(...preDrivePath)
    } else if (preDrivePath !== null) {
      uri.push(preDrivePath)
    }

    for (const element of ['drive/v3', api, fileId, path]) {
      if (element !== null) {
        uri.push(element)
      }
    }

    return new ArrayStringifier()
      .setArray(uri)
      .setPostfix(stringifyQueryParameters(queryParameters))
      .setSeparator('/')
      .process()
  }
}
