import type { JsonValue, SetRequired } from 'type-fest'
import type { IStandardParameters, IUser, TFields } from '../types'

type TAboutGetQueryParameters =
  | SetRequired<IStandardParameters, 'fields'>
  | TFields

type TAboutKind = 'drive#about'

interface IAboutDriveTheme {
  id: string
  backgroundImageLink: string
  colorRgb: string
}
interface IAboutStorageQuota {
  limit?: string
  usageInDrive: string
  usageInDriveTrash: string
  usage: string
}

interface IAbout {
  kind: TAboutKind
  storageQuota: IAboutStorageQuota
  driveThemes: IAboutDriveTheme[]
  canCreateDrives: boolean
  importFormats: Record<string, JsonValue>
  exportFormats: Record<string, JsonValue>
  appInstalled: boolean
  user: IUser
  folderColorPalette: string[]
  maxImportSizes: Record<string, string>
  maxUploadSize: string
}

export type {
  IAbout,
  IAboutDriveTheme,
  IAboutStorageQuota,
  TAboutGetQueryParameters,
  TAboutKind
}
