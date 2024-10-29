import type { TQueryParameters } from 'src/types'

type TPreDrivePath = string | string[] | undefined

interface IAboutParameters {
  queryParameters: TQueryParameters
}

interface IFilesParameters {
  fileId?: string
  method?: string
  preDrivePath?: TPreDrivePath
  queryParameters?: TQueryParameters | undefined
}

interface IPermissionsParameters {
  fileId: string
  permissionId?: string
  queryParameters: TQueryParameters | undefined
}

interface IUriParameters {
  api: string
  fileId?: string | undefined
  path?: string | undefined
  preDrivePath?: TPreDrivePath
  queryParameters?: TQueryParameters | undefined
}

export type {
  IAboutParameters,
  IFilesParameters,
  IPermissionsParameters,
  IUriParameters
}
