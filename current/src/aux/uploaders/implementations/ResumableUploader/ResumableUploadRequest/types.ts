import type { IFileOutput } from '../../../../../api/files/types'

interface IRequestUploadStatusResultType {
  isComplete: boolean
  transferredByteCount: number
}

interface IUploadChunkResultType extends IRequestUploadStatusResultType {
  json?: IFileOutput
}

export type { IRequestUploadStatusResultType, IUploadChunkResultType }
