import type { IFileOutput } from 'api/files/types'
import type { GDriveApi } from 'api/GDriveApi'
import type { ReadonlyDeep } from 'type-fest'
import type { TSimpleData } from 'uploaders/types'
import type {
  IRequestUploadStatusResultType,
  IUploadChunkResultType
} from './types'

import { Fetcher } from 'aux/Fetcher'
import { FetchResponseError } from 'aux/Fetcher/errors/FetchResponseError'

import { convertReadonlyDeepTSimpleDataToTBodyType } from '../../helpers/convertReadonlyDeepTSimpleDataToTBodyType'
import { ResumableUploaderError } from '../errors/ResumableUploaderError'

const HTTP_RESUME_INCOMPLETE = 308

export class ResumableUploadRequest {
  private contentLength: number
  private _transferredByteCount = 0

  // eslint-disable-next-line @typescript-eslint/max-params
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
        transferredByteCount: ResumableUploadRequest.processRange(response)
      }
    }
  }

  setContentLength(contentLength: number): this {
    this.contentLength = contentLength

    return this
  }

  get transferredByteCount(): number {
    return this._transferredByteCount
  }

  async uploadChunk(
    chunk: ReadonlyDeep<TSimpleData>
  ): Promise<IUploadChunkResultType> {
    const fetcher = new Fetcher(this.gDriveApi)
      .setMethod('PUT')
      .setBody(
        convertReadonlyDeepTSimpleDataToTBodyType(chunk),
        this.dataMimeType
      )
      .setResource(this.location)

    if (this.shouldUseMultipleRequests) {
      const from = this.transferredByteCount
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers
      const to = from + chunk.length - 1
      const total = this.contentLength || '*'

      fetcher.appendHeader('Content-Range', `bytes ${from}-${to}/${total}`)
    }

    try {
      const response = await fetcher.fetch()

      this._transferredByteCount += chunk.length

      return {
        isComplete: true,
        json: (await response.json()) as IFileOutput,
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

      const transferredByteCount = ResumableUploadRequest.processRange(response)

      this._transferredByteCount += transferredByteCount

      return {
        isComplete: false,
        transferredByteCount
      }
    }
  }

  private static processRange(response: ReadonlyDeep<Response>): number {
    const range = response.headers.get('Range') ?? ''

    if (!range) {
      throw new ResumableUploaderError("No 'Range' header to process", response)
    }

    const rightExpression = range.split('=')[1] ?? ''

    if (!rightExpression) {
      throw new ResumableUploaderError(
        "'!rightExpression', examine the 'Range' header",
        response
      )
    }

    return rightExpression
      .split('-')
      .map(Number)
      .reduce(
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        (previousValue, currentValue) => currentValue - previousValue + 1
      )
  }
}
