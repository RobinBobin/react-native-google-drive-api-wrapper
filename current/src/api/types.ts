interface IGDriveAccessParameters {
  accessToken: string
  fetchTimeout: number
}

type TAlt = 'json' | 'media' | 'proto' | 'sse'
type TFields = string | string[]
type TPublished = 'published'

// https://cloud.google.com/apis/docs/system-parameters
interface IStandardParameters {
  alt?: TAlt
  fields?: TFields
  prettyPrint?: boolean
}

interface IUser {
  displayName: string
  kind: string
  me: boolean
  permissionId: string
  emailAddress: string
  photoLink: string
}

export type {
  IGDriveAccessParameters,
  IStandardParameters,
  IUser,
  TAlt,
  TFields,
  TPublished
}
