import type { Fetcher } from '../../../Fetcher'

import { mimeTypes } from '@robinbobin/mimetype-constants'
import { isBoolean, isNumber } from 'radashi'

import { UploaderWithDataMimeType } from '../../base/UploaderWithDataMimeType'
import { ResumableUploaderError } from './errors/ResumableUploaderError'
import { ResumableUploadRequest } from './ResumableUploadRequest'

export class ResumableUploader extends UploaderWithDataMimeType<ResumableUploadRequest> {
  private contentLength?: number
  private shouldUseMultipleRequests?: boolean

  constructor(fetcher: Readonly<Fetcher>) {
    super(fetcher, 'resumable')
  }

  setContentLength(contentLength: number): this {
    const minContentLength = 1

    if (contentLength < minContentLength) {
      throw new TypeError(
        `\`ResumableUploader.setContentLength()\`: \`contentLength\` can't be less than ${minContentLength}`
      )
    }

    if (isNumber(this.contentLength)) {
      throw new TypeError(
        '`ResumableUploader.contentLength` has already been set for this instance'
      )
    }

    this.contentLength = contentLength

    return this
  }

  setShouldUseMultipleRequests(shouldUseMultipleRequests: boolean): this {
    if (isBoolean(this.shouldUseMultipleRequests)) {
      throw new TypeError(
        '`ResumableUploader.shouldUseMultipleRequests` has already been set for this instance'
      )
    }

    this.shouldUseMultipleRequests = shouldUseMultipleRequests

    return this
  }

  protected async _execute(): Promise<ResumableUploadRequest> {
    if (isNumber(this.contentLength) && this.contentLength) {
      this.fetcher.appendHeader(
        'X-Upload-Content-Length',
        this.contentLength.toString()
      )
    }

    this.fetcher.appendHeader('X-Upload-Content-Type', this.dataMimeType)

    if (this.requestBody) {
      this.fetcher.setBody(this.requestBody, mimeTypes.application.json)
    }

    const response = await this.fetcher.fetch()
    const location = response.headers.get('Location') ?? ''

    if (!location) {
      throw new ResumableUploaderError(
        "No 'Location' header in the original response",
        response
      )
    }

    return new ResumableUploadRequest(
      this.contentLength,
      this.dataMimeType,
      this.fetcher.gDriveApi,
      location,
      this.shouldUseMultipleRequests
    )
  }
}
