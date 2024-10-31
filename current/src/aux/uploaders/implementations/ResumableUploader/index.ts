import type { Fetcher } from 'aux/Fetcher'

import { MIME_TYPE_JSON_UTF8 } from 'src/constants'
import { UploaderWithDataMimeType } from 'uploaders/base/UploaderWithDataMimeType'

import { ResumableUploaderError } from './errors/ResumableUploaderError'
import { ResumableUploadRequest } from './ResumableUploadRequest'

export class ResumableUploader extends UploaderWithDataMimeType<ResumableUploadRequest> {
  private contentLength = 0
  private shouldUseMultipleRequests = false

  constructor(fetcher: Readonly<Fetcher>) {
    super(fetcher, 'resumable')
  }

  setContentLength(contentLength: number): this {
    this.contentLength = contentLength

    return this
  }

  setShouldUseMultipleRequests(shouldUseMultipleRequests: boolean): this {
    this.shouldUseMultipleRequests = shouldUseMultipleRequests

    return this
  }

  protected async _execute(): Promise<ResumableUploadRequest> {
    if (this.contentLength) {
      this.fetcher.appendHeader(
        'X-Upload-Content-Length',
        this.contentLength.toString()
      )
    }

    this.fetcher.appendHeader('X-Upload-Content-Type', this.dataMimeType)

    if (this.requestBody) {
      this.fetcher.setBody(this.requestBody, MIME_TYPE_JSON_UTF8)
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
