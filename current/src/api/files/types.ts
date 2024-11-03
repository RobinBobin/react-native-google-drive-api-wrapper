import type { IPermissionOutput } from 'api/permissions/types'
import type { IStandardParameters, IUser, TPublished } from 'api/types'
import type { JsonObject, SetRequired } from 'type-fest'
import type { IListQueryBuilder } from './ListQueryBuilder/types'

type TFileKind = 'drive#file'
type TFileListKind = 'drive#fileList'
type TFilesIncludeLabels = string | string[]

type TFileSpaceAppDataFolder = 'appDataFolder'
type TFileSpaceDrive = 'drive'
type TFileSpacePhotos = 'photos'

type TFileOutputSpace =
  | TFileSpaceAppDataFolder
  | TFileSpaceDrive
  | TFileSpacePhotos

type TFilesListSpace = TFileSpaceAppDataFolder | TFileSpaceDrive

type TFilesListCorpora = 'allDrives' | 'domain' | 'drive' | 'user'

type TFilesListOrderByProperty =
  | 'createdTime'
  | 'folder'
  | 'modifiedByMeTime'
  | 'modifiedTime'
  | 'name'
  | 'name_natural'
  | 'quotaBytesUsed'
  | 'recency'
  | 'sharedWithMeTime'
  | 'starred'
  | 'viewedByMeTime'

type TFilesListSortOrder = 'desc'

type TFilesListOrderBy =
  | string
  | [TFilesListOrderByProperty, (TFilesListSortOrder | undefined)?]

interface ICreateGetFetcherParams {
  fileId: string
  isContent?: boolean
  queryParameters: JsonObject | undefined
  range?: string | undefined
}

interface ICreateIfNotExistsResultType<TResult> {
  alreadyExisted: boolean
  result: TResult
}

interface IIncludeLabels {
  includeLabels?: TFilesIncludeLabels
}
interface IFilesCreateQueryParameters
  extends IStandardParameters,
    IIncludeLabels {
  ignoreDefaultVisibility?: boolean
  keepRevisionForever?: boolean
  // ISO 639-1 code
  ocrLanguage?: string
  supportsAllDrives?: boolean
  useContentAsIndexableText?: boolean
  includePermissionsForView?: TPublished
}

interface IFilesListQueryParameters
  extends IStandardParameters,
    IIncludeLabels {
  corpora?: TFilesListCorpora
  driveId?: string
  includeItemsFromAllDrives?: boolean
  orderBy?: TFilesListOrderBy
  pageSize?: number
  pageToken?: string
  q?: string | IListQueryBuilder
  spaces?: TFilesListSpace | TFilesListSpace[]
  supportsAllDrives?: boolean
  includePermissionsForView?: TPublished
}

interface IFileInputContentHintThumbnail {
  // RFC 4648 section 5
  image: string
  mimeType: string
}

interface IFileInputContentHints {
  indexableText?: string
  thumbnail?: IFileInputContentHintThumbnail
}

interface IFileInput {
  copyRequiresWriterPermission?: boolean
  contentHints?: IFileInputContentHints
  writersCanShare?: boolean
  mimeType?: string
  parents?: string[]
  folderColorRgb?: string
  id?: string
  name?: string
  description?: string
  starred?: boolean
  trashed?: boolean
  // RFC 3339 date-time
  createdTime?: string
  modifiedTime?: string
  viewedByMeTime?: string
  originalFilename?: string
}

type TFileOutputBase = SetRequired<
  Omit<IFileInput, 'contentHints'>,
  'id' | 'name'
>

interface IFileOutput extends TFileOutputBase {
  kind: TFileKind
  driveId?: string
  fileExtension?: string
  md5Checksum?: string
  viewedByMe: boolean
  exportLinks: Record<string, string>
  thumbnailLink?: string
  iconLink: string
  shared?: boolean
  lastModifyingUser?: IUser
  owners?: IUser[]
  headRevisionId?: string
  sharingUser?: IUser
  webViewLink: string
  webContentLink?: string
  size?: string
  permissions?: IPermissionOutput
  hasThumbnail: boolean
  spaces: TFileOutputSpace[]
  explicitlyTrashed?: boolean
  // RFC 3339 date-time
  modifiedByMeTime?: string
  sharedWithMeTime?: string
  quotaBytesUsed: string
  version: string
  ownedByMe?: boolean
}

interface IFilesListResultType {
  nextPageToken: string
  kind: TFileListKind
  incompleteSearch: boolean
  files: IFileOutput[]
}

export type {
  ICreateGetFetcherParams,
  ICreateIfNotExistsResultType,
  IFileInput,
  IFileInputContentHints,
  IFileInputContentHintThumbnail,
  IFileOutput,
  IFilesCreateQueryParameters,
  IFilesListQueryParameters,
  IFilesListResultType,
  IIncludeLabels,
  TFileKind,
  TFileOutputSpace,
  TFilesIncludeLabels,
  TFilesListCorpora,
  TFilesListOrderBy,
  TFilesListOrderByProperty,
  TFilesListSortOrder,
  TFilesListSpace
}
