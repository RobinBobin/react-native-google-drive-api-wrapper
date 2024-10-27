import type { TQueryParameters } from "src/types"

type TPreDrivePath = string | string[] | undefined

export interface IAboutParameters {
  queryParameters: TQueryParameters
}

export interface IFilesParameters {
  fileId?: string
  method?: string
  preDrivePath?: TPreDrivePath
  queryParameters?: TQueryParameters | undefined
}

export interface IPermissionsParameters {
  fileId: string
  permissionId?: string
  queryParameters: TQueryParameters | undefined
}

export interface IUriParameters {
  api: string
  fileId?: string | undefined
  path?: string | undefined
  preDrivePath?: TPreDrivePath
  queryParameters?: TQueryParameters | undefined
}
