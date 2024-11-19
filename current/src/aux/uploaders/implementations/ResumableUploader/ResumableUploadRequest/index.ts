import type { ReadonlyDeep } from 'type-fest'
import type { IFileOutput } from '../../../../../api/files/types'
import type { GDriveApi } from '../../../../../api/GDriveApi'
import type { TSimpleData } from '../../../types'
import type {
  IRequestUploadStatusResultType,
  IUploadChunkResultType
} from './types'

import { isNumber } from 'radashi'

import { Fetcher } from '../../../../Fetcher'
import { FetchResponseError } from '../../../../Fetcher/errors/FetchResponseError'
import { convertReadonlyDeepTSimpleDataToTBodyType } from '../../helpers/convertReadonlyDeepTSimpleDataToTBodyType'
import { ResumableUploaderError } from '../errors/ResumableUploaderError'

const HTTP_RESUME_INCOMPLETE = 308

export class ResumableUploadRequest {
  private _transferredByteCount = 0

  // eslint-disable-next-line @typescript-eslint/max-params
  constructor(
    private contentLength: number | undefined,
    private readonly dataMimeType: string,
    private readonly gDriveApi: GDriveApi,
    private readonly location: string,
    private readonly shouldUseMultipleRequests: boolean | undefined
  ) {
    // Nothing to do.
  }

  async requestUploadStatus(): Promise<IRequestUploadStatusResultType> {
    const contentLength = this.contentLength ?? '*'
    const contentRange = `bytes */${contentLength}`

    try {
      await new Fetcher(this.gDriveApi)
        .appendHeader('Content-Range', contentRange)
        .setMethod('PUT')
        .setResource(this.location)
        .fetch()

      return {
        isComplete: true,
        transferredByteCount: this.transferredByteCount
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

      if (this.transferredByteCount !== transferredByteCount) {
        throw new TypeError(
          `this.transferredByteCount (${this.transferredByteCount}) !== transferredByteCount ${transferredByteCount}`
        )
      }

      return {
        isComplete: false,
        transferredByteCount
      }
    }
  }

  setContentLength(contentLength: number): this {
    if (contentLength < this.transferredByteCount) {
      throw new TypeError(
        `\`ResumableUploadRequest.setContentLength()\`: \`contentLength\` can't be less than the number of bytes already transferred (${this.transferredByteCount})`
      )
    }

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

    if (this.shouldUseMultipleRequests ?? false) {
      const from = this.transferredByteCount
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers
      const to = from + chunk.length - 1
      const total = this.contentLength ?? '*'

      fetcher.appendHeader('Content-Range', `bytes ${from}-${to}/${total}`)
    }

    try {
      const json = await fetcher.fetchJson<IFileOutput>()

      this._transferredByteCount += chunk.length

      return {
        isComplete: true,
        json,
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

      this._transferredByteCount = ResumableUploadRequest.processRange(response)

      return {
        isComplete: false,
        transferredByteCount: this._transferredByteCount
      }
    }
  }

  private static processRange(response: ReadonlyDeep<Response>): number {
    const range = response.headers.get('Range') ?? ''

    if (!range) {
      throw new ResumableUploaderError("No 'Range' header to process", response)
    }

    const rightExpression = range.split('=')[1] ?? ''

    const [from, to] = rightExpression.split('-').map(Number)

    if (!rightExpression || !isNumber(from) || !isNumber(to)) {
      throw new ResumableUploaderError(
        "`!rightExpression || !isNumber(from) || !isNumber(to)`, examine the 'Range' header",
        response
      )
    }

    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    return to - from + 1
  }
}
