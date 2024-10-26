type TPreDrivePath = string | string[] | undefined

export type TGenericQueryParameters = Record<string, { toString(): string } | undefined>

export interface IAboutParameters {
  queryParameters: TGenericQueryParameters
}

export interface IFilesParameters {
  fileId?: string
  method?: string
  preDrivePath?: TPreDrivePath
  queryParameters?: TGenericQueryParameters | undefined
}

export interface IPermissionsParameters {
  fileId: string
  permissionId?: string
  queryParameters: TGenericQueryParameters | undefined
}

export interface IUriParameters {
  api: string
  fileId?: string | undefined
  path?: string | undefined
  preDrivePath?: TPreDrivePath
  queryParameters?: TGenericQueryParameters | undefined
}
