export interface IRequestUploadStatusResultType {
  isComplete: boolean
  transferredByteCount: number
}

export interface IUploadChunkResultType extends IRequestUploadStatusResultType {
  json?: any
}
