import type { IRequestUploadStatusResultType, IUploadChunkResultType } from './types'
import type { TData } from '../../../withdata/types'
import { Fetcher } from '../../../../Fetcher'
import { GDriveApi } from '../../../../../GDriveApi'
import { HttpError } from '../../../../../../HttpError'

export class ResumableUploadRequest {
  private readonly dataMimeType: string
  private readonly gDriveApi: GDriveApi
  private readonly location: string
  private readonly shouldUseMultipleRequests: boolean

  private contentLength: number
  private __transferredByteCount = 0

  constructor(
    contentLength: number,
    dataMimeType: string,
    gDriveApi: GDriveApi,
    location: string,
    shouldUseMultipleRequests: boolean
  ) {
    this.contentLength = contentLength
    this.dataMimeType = dataMimeType
    this.gDriveApi = gDriveApi
    this.location = location
    this.shouldUseMultipleRequests = shouldUseMultipleRequests
  }

  async requestUploadStatus(): Promise<IRequestUploadStatusResultType> {
    const response = await new Fetcher<Response>(this.gDriveApi)
      .appendHeader('Content-Range', `bytes */${this.contentLength || '*'}`)
      .setMethod('PUT')
      .setResource(this.location)
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

  setContentLength(contentLength: number): ResumableUploadRequest {
    this.contentLength = contentLength

    return this
  }

  get transferredByteCount() {
    return this.__transferredByteCount
  }

  async uploadChunk(chunk: TData): Promise<IUploadChunkResultType> {
    const fetcher = new Fetcher<Response>(this.gDriveApi)
      .setMethod('PUT')
      .setBody(Array.isArray(chunk) ? new Uint8Array(chunk) : chunk, this.dataMimeType)
      .setResource(this.location)

    if (this.shouldUseMultipleRequests) {
      const from = this.transferredByteCount
      const to = from + chunk.length - 1
      const total = this.contentLength || '*'

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

  private processRange(response: Response) {
    return response.headers
      .get('Range')!
      .split('=')[1]!
      .split('-')
      .map(Number)
      .reduce((previousValue, currentValue) => currentValue - previousValue + 1)
  }
}
