export class BlobToByteArrayError extends Error {
  constructor(
    readonly event: ProgressEvent<FileReader>,
    message: string,
    readonly reader: FileReader
  ) {
    super(message)
  }
}

BlobToByteArrayError.prototype.name = 'BlobToByteArrayError'
