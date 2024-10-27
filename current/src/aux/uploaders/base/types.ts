import type { TQueryParameters } from "src/types"

export type TUploadQueryParameters = TQueryParameters & { uploadType?: never }
export type TUploadType = 'media' | 'multipart' | 'resumable'
