import type { TQueryParameters } from 'src/types'

type TUploadQueryParameters = TQueryParameters & { uploadType?: never }
type TUploadType = 'media' | 'multipart' | 'resumable'

export type { TUploadQueryParameters, TUploadType }
