interface IGDriveAccessParameters {
  accessToken: string
  fetchTimeout: number
}

type TAlt = 'json' | 'media' | 'proto' | 'sse'
type TFields = string | string[]

// https://cloud.google.com/apis/docs/system-parameters
// Index signature for type 'string' is missing in type 'TStandardParameters'
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type TStandardParameters = {
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
  IUser,
  TAlt,
  TFields,
  TStandardParameters
}
