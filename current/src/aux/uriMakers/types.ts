import type { JsonObject } from 'type-fest'

interface IMakeAboutUriParameters {
  queryParameters: JsonObject
}

interface IMakeFilesUriParameters {
  fileId?: string
  method?: string
  preDrivePath?: string | undefined
  queryParameters?: JsonObject | undefined
}

interface IMakePermissionsUriParameters {
  fileId: string
  permissionId?: string
  queryParameters: JsonObject | undefined
}

interface IMakeUriParameters {
  api: string
  fileId?: string | undefined
  path?: string | undefined
  preDrivePath?: string | undefined
  queryParameters?: JsonObject | undefined
}

export type {
  IMakeAboutUriParameters,
  IMakeFilesUriParameters,
  IMakePermissionsUriParameters,
  IMakeUriParameters
}
