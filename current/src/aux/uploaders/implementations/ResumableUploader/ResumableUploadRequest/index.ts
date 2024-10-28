import type {
  IRequestUploadStatusResultType,
  IUploadChunkResultType
} from './types'
import type { TSimpleData } from 'uploaders/types'
import { Fetcher } from 'aux/Fetcher'
import type { GDriveApi } from 'api/GDriveApi'
import { FetchResponseError } from 'aux/Fetcher/errors/FetchResponseError'
import { ResumableUploaderError } from '../errors/ResumableUploaderError'

const HTTP_RESUME_INCOMPLETE = 308

export class ResumableUploadRequest {
  private contentLength: number
  private _transferredByteCount = 0

  constructor(
    contentLength: number,
    private readonly dataMimeType: string,
    private readonly gDriveApi: GDriveApi,
    private readonly location: string,
    private readonly shouldUseMultipleRequests: boolean
  ) {
    this.contentLength = contentLength
  }

  async requestUploadStatus(): Promise<IRequestUploadStatusResultType> {
    const contentLength = this.contentLength || '*'
    const contentRange = `bytes */${contentLength}`

    try {
      await new Fetcher(this.gDriveApi)
        .appendHeader('Content-Range', contentRange)
        .setMethod('PUT')
        .setResource(this.location)
        .fetch()

      return {
        isComplete: true,
        transferredByteCount: this._transferredByteCount
      }
    } catch (error) {
      if (!(error instanceof FetchResponseError)) {
        throw error
      }

      const { response } = error

      if (response.status !== HTTP_RESUME_INCOMPLETE) {
        throw error
      }

      return {
        isComplete: false,
        transferredByteCount: this.processRange(response)
      }
    }
  }

  setContentLength(contentLength: number): ResumableUploadRequest {
    this.contentLength = contentLength

    return this
  }

  get transferredByteCount(): number {
    return this._transferredByteCount
  }

  async uploadChunk(chunk: TSimpleData): Promise<IUploadChunkResultType> {
    const fetcher = new Fetcher(this.gDriveApi)
      .setMethod('PUT')
      .setBody(
        Array.isArray(chunk) ? new Uint8Array(chunk) : chunk,
        this.dataMimeType
      )
      .setResource(this.location)

    if (this.shouldUseMultipleRequests) {
      const from = this.transferredByteCount
      const to = from + chunk.length - 1
      const total = this.contentLength || '*'

      fetcher.appendHeader('Content-Range', `bytes ${from}-${to}/${total}`)
    }

    try {
      const response = await fetcher.fetch()

      this._transferredByteCount += chunk.length

      return {
        isComplete: true,
        json: await response.json(),
        transferredByteCount: chunk.length
      }
    } catch (error) {
      if (!(error instanceof FetchResponseError)) {
        throw error
      }

      const { response } = error

      if (response.status !== HTTP_RESUME_INCOMPLETE) {
        throw error
      }

      const transferredByteCount = this.processRange(response)

      this._transferredByteCount += transferredByteCount

      return {
        isComplete: false,
        transferredByteCount
      }
    }
  }

  private processRange(response: Response): number {
    const range = response.headers.get('Range')

    if (!range) {
      throw new ResumableUploaderError("No 'Range' header to process", response)
    }

    const rightExpression = range.split('=')[1]

    if (!rightExpression) {
      throw new ResumableUploaderError(
        "'!rightExpression', examine the 'Range' header",
        response
      )
    }

    return rightExpression
      .split('-')
      .map(Number)
      .reduce((previousValue, currentValue) => currentValue - previousValue + 1)
  }
}
