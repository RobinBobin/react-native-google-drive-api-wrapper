export interface RequestUploadStatusResultType {
  isComplete: boolean
  transferredByteCount: number
}

export interface UploadChunkResultType extends RequestUploadStatusResultType {
  json?: any
}
