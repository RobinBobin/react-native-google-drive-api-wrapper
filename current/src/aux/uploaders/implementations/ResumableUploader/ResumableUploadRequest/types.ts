import type { TJson } from 'src/types'

interface IRequestUploadStatusResultType {
  isComplete: boolean
  transferredByteCount: number
}

interface IUploadChunkResultType extends IRequestUploadStatusResultType {
  json?: TJson
}

export type { IRequestUploadStatusResultType, IUploadChunkResultType }
