import type { JsonObject } from 'type-fest'

interface IRequestUploadStatusResultType {
  isComplete: boolean
  transferredByteCount: number
}

interface IUploadChunkResultType extends IRequestUploadStatusResultType {
  json?: JsonObject
}

export type { IRequestUploadStatusResultType, IUploadChunkResultType }
