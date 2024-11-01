import type { TStandardParameters } from 'api/types'

type TPermissionKind = 'drive#permission'
type TPermissionType = 'anyone' | 'domain' | 'group' | 'user'
type TPermissionDetailPermissionType = 'file' | 'member'

type TPermissionDetailRole =
  | 'commenter'
  | 'fileOrganizer'
  | 'organizer'
  | 'reader'
  | 'writer'

type TPermissionRole = TPermissionDetailRole | 'owner'

interface IPermissionInput {
  type: TPermissionType
  emailAddress?: string
  role: TPermissionRole
  allowFileDiscovery?: boolean
  domain?: string
  // RFC 3339 date-time
  expirationTime?: string
  view?: 'published'
  pendingOwner?: boolean
}

interface IPermissionDetail {
  permissionType: TPermissionDetailPermissionType
  inheritedFrom: string
  role: TPermissionDetailRole
  inherited: boolean
}

interface IPermissionOutput extends IPermissionInput {
  id: string
  displayName?: string
  kind: TPermissionKind
  permissionDetails: IPermissionDetail[]
  photoLink?: string
  deleted?: boolean
}

interface IPermissionsCreateQueryParameters extends TStandardParameters {
  emailMessage?: string
  moveToNewOwnersRoot?: boolean
  sendNotificationEmail?: boolean
  supportsAllDrives?: boolean
  transferOwnership?: boolean
  useDomainAdminAccess?: boolean
}

interface IPermissionsDeleteQueryParameters extends TStandardParameters {
  supportsAllDrives?: boolean
  useDomainAdminAccess?: boolean
}

export type {
  IPermissionDetail,
  IPermissionInput,
  IPermissionOutput,
  IPermissionsCreateQueryParameters,
  IPermissionsDeleteQueryParameters,
  TPermissionDetailPermissionType,
  TPermissionDetailRole,
  TPermissionKind,
  TPermissionRole,
  TPermissionType
}
