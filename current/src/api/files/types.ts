import type { Except, SetRequired } from 'type-fest'
import type { IPermissionOutput } from '../permissions/types'
import type { IStandardParameters, IUser, TPublished } from '../types'
import type { ListQueryBuilder } from './ListQueryBuilder'

type TFileKind = 'drive#file'
type TFileGeneratedIdsKind = 'drive#generatedIds'
type TFileListKind = 'drive#fileList'

type TFileGeneratedIdType = 'files' | 'shortcuts'

type TFileSpaceAppDataFolder = 'appDataFolder'
type TFileSpaceDrive = 'drive'
type TFileSpacePhotos = 'photos'

type TFileOutputSpace =
  | TFileSpaceAppDataFolder
  | TFileSpaceDrive
  | TFileSpacePhotos

type TFilesListSpace = TFileSpaceAppDataFolder | TFileSpaceDrive
type TFilesGenerateIdsSpace = TFileSpaceAppDataFolder | TFileSpaceDrive

type TFilesIncludeLabels = string | string[]

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
  | [TFilesListOrderByProperty, (TFilesListSortOrder | undefined)?][]

interface ICreateIfNotExistsResultType<ExecuteResultType> {
  alreadyExisted: boolean
  result: ExecuteResultType
}

interface IFilesCommonQueryParameters extends IStandardParameters {
  includeLabels?: TFilesIncludeLabels
  includePermissionsForView?: TPublished
  supportsAllDrives?: boolean
}

interface IFilesOcrLanguage extends IStandardParameters {
  // ISO 639-1 code
  ocrLanguage?: string
}

interface IFilesCopyQueryParameters
  extends IFilesCommonQueryParameters,
    IFilesOcrLanguage {
  ignoreDefaultVisibility?: boolean
  keepRevisionForever?: boolean
}

interface IFilesCreateQueryParameters
  extends IFilesCommonQueryParameters,
    IFilesOcrLanguage {
  ignoreDefaultVisibility?: boolean
  keepRevisionForever?: boolean
  useContentAsIndexableText?: boolean
}

interface IFilesExportQueryParameters extends IStandardParameters {
  mimeType: string
}

interface IFilesGenerateIdsQueryParameters extends IStandardParameters {
  count?: number
  space?: TFilesGenerateIdsSpace
  type?: TFileGeneratedIdType
}

interface IFilesGenerateIdsResultType {
  ids: string[]
  space: TFilesGenerateIdsSpace
  kind: TFileGeneratedIdsKind
}

interface IFilesGetQueryParameters
  extends Except<IFilesCommonQueryParameters, 'alt'> {
  acknowledgeAbuse?: boolean
}

interface IFilesGetParameters {
  queryParameters?: IFilesGetQueryParameters
  range?: string
}

interface ICreateGetFetcherParams {
  fileId: string
  isContent?: boolean
  queryParameters?: IFilesGetQueryParameters | undefined
  range?: string | undefined
}

interface IFilesListQueryParameters extends IFilesCommonQueryParameters {
  corpora?: TFilesListCorpora
  driveId?: string
  includeItemsFromAllDrives?: boolean
  orderBy?: TFilesListOrderBy
  pageSize?: number
  pageToken?: string
  q?: string | ListQueryBuilder
  spaces?: TFilesListSpace | TFilesListSpace[]
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

interface IFilesCopyParameters {
  queryParameters?: IFilesCopyQueryParameters
  requestBody?: IFileInput
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
  IFilesCommonQueryParameters,
  IFilesCopyParameters,
  IFilesCopyQueryParameters,
  IFilesCreateQueryParameters,
  IFilesExportQueryParameters,
  IFilesGenerateIdsQueryParameters,
  IFilesGenerateIdsResultType,
  IFilesGetParameters,
  IFilesGetQueryParameters,
  IFilesListQueryParameters,
  IFilesListResultType,
  TFileGeneratedIdsKind,
  TFileGeneratedIdType,
  TFileKind,
  TFileOutputSpace,
  TFilesGenerateIdsSpace,
  TFilesIncludeLabels,
  TFilesListCorpora,
  TFilesListOrderBy,
  TFilesListOrderByProperty,
  TFilesListSortOrder,
  TFilesListSpace
}
