import type { TJson } from 'src/types'

export interface IRequestUploadStatusResultType {
  isComplete: boolean
  transferredByteCount: number
}

export interface IUploadChunkResultType extends IRequestUploadStatusResultType {
  json?: TJson
}
