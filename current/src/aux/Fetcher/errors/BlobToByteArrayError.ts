import type { ReadonlyDeep } from 'type-fest'

class BlobToByteArrayError extends Error {
  constructor(
    readonly event: ProgressEvent<FileReader>,
    message: string,
    readonly reader: ReadonlyDeep<FileReader>
  ) {
    super(message)
  }
}

BlobToByteArrayError.prototype.name = 'BlobToByteArrayError'

export { BlobToByteArrayError }
