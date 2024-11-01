import type { JsonObject } from 'type-fest'

type TUploadQueryParameters = JsonObject & { uploadType?: never }
type TUploadType = 'media' | 'multipart' | 'resumable'

export type { TUploadQueryParameters, TUploadType }
