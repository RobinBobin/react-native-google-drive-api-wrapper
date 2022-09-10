import { RequestUploadStatusResultType, UploadChunkResultType } from './types'
import { Uploader } from '../Uploader'
import { Data } from '../Uploader/types'
import { Fetcher } from '../../Fetcher'
import { FetchResultType } from '../../Fetcher/types'
import { FilesApi } from '../../../files/FilesApi'
import { HttpError } from '../../../../HttpError'
import { MimeType } from '../../../../MimeType'

export class ResumableUploader extends Uploader {
  private contentLength = 0
  private location?: string
  private shouldUseMultipleRequests = false
  private __transferredByteCount = 0

  constructor(fetcher: Fetcher<FilesApi>) {
    super(fetcher, 'resumable', false)
  }

  async requestUploadStatus(): Promise<RequestUploadStatusResultType> {
    const response: Response = await new Fetcher(this.fetcher.gDriveApi)
      .appendHeader('Content-Range', `bytes */${this.contentLength ?? '*'}`)
      .setMethod('PUT')
      .setResource(this.location!)
      .fetch()

    if (response.ok) {
      return {
        isComplete: true,
        transferredByteCount: this.__transferredByteCount,
      }
    }

    if (response.status === 308) {
      return {
        isComplete: false,
        transferredByteCount: this.processRange(response),
      }
    }

    throw await HttpError.create(response)
  }

  setContentLength(contentLength: number): ResumableUploader {
    this.contentLength = contentLength

    return this
  }

  setMimeType(mimeType: string): ResumableUploader {
    this.mimeType = mimeType

    return this
  }

  setShouldUseMultipleRequests(shouldUseMultipleRequests: boolean): ResumableUploader {
    this.shouldUseMultipleRequests = shouldUseMultipleRequests

    return this
  }

  get transferredByteCount() {
    return this.__transferredByteCount
  }

  async uploadChunk(chunk: Data): Promise<UploadChunkResultType> {
    const fetcher = new Fetcher(this.fetcher.gDriveApi)
      .setMethod('PUT')
      .setBody(Array.isArray(chunk) ? new Uint8Array(chunk) : chunk, this.mimeType)
      .setResource(this.location!)

    if (this.shouldUseMultipleRequests) {
      const from = this.transferredByteCount
      const to = from + chunk.length - 1
      const total = this.contentLength ?? '*'

      fetcher.appendHeader('Content-Range', `bytes ${from}-${to}/${total}`)
    }

    const response: Response = await fetcher.fetch()

    if (!this.shouldUseMultipleRequests || response.ok) {
      this.__transferredByteCount += chunk.length

      return {
        isComplete: true,
        json: await response.json(),
        transferredByteCount: chunk.length,
      }
    }

    if (response.status === 308) {
      const transferredByteCount = this.processRange(response)

      this.__transferredByteCount += transferredByteCount

      return {
        isComplete: false,
        transferredByteCount,
      }
    }

    throw await HttpError.create(response)
  }

  protected async _execute(): FetchResultType {
    if (this.data?.length) {
      this.setContentLength(this.data.length)
    }

    if (this.contentLength) {
      this.fetcher.appendHeader('X-Upload-Content-Length', this.contentLength.toString())
    }

    this.fetcher.appendHeader('X-Upload-Content-Type', this.mimeType!)

    if (this.requestBody) {
      this.fetcher.setBody(this.requestBody as string, MimeType.JSON_UTF8)
    }

    const response: Response = await this.fetcher.fetch()

    this.location = response.headers.get('Location')!

    if (this.data) {
      return this.uploadChunk(this.data)
    }

    return this
  }

  private processRange(response: Response) {
    return response.headers
      .get('Range')!
      .split('=')[1]
      .split('-')
      .map(Number)
      .reduce((previousValue, currentValue) => currentValue - previousValue + 1)
  }
}
