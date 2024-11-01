import type { IUser, TFields, TStandardParameters } from 'api/types'
import type { JsonValue, SetRequired } from 'type-fest'

type TAboutGetQueryParameters =
  | SetRequired<TStandardParameters, 'fields'>
  | TFields

interface IAboutGetResultType {
  kind: string
  storageQuota: {
    limit: string
    usageInDrive: string
    usageInDriveTrash: string
    usage: string
  }
  driveThemes: {
    id: string
    backgroundImageLink: string
    colorRgb: string
  }[]
  canCreateDrives: boolean
  importFormats: Record<string, JsonValue>
  exportFormats: Record<string, JsonValue>
  appInstalled: boolean
  user: IUser
  folderColorPalette: string[]
  maxImportSizes: Record<string, string>
  maxUploadSize: string
  teamDriveThemes: {
    id: string
    backgroundImageLink: string
    colorRgb: string
  }[]
  canCreateTeamDrives: boolean
}

export type { IAboutGetResultType, TAboutGetQueryParameters }
