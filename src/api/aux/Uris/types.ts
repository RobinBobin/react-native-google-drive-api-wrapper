type PreDrivePath = string | string[]

export interface AboutParameters {
  queryParameters: object
}

export interface FilesParameters {
  fileId?: string
  method?: string
  preDrivePath?: PreDrivePath
  queryParameters?: object
}

export interface PermissionsParameters {
  fileId: string
  permissionId?: string
  queryParameters?: object
}

export interface UriParameters {
  api: string
  fileId?: string | null
  path?: string | null
  preDrivePath?: PreDrivePath | null
  queryParameters?: object
}
