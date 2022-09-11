import { ResumableUploadRequest } from './ResumableUploadRequest'
import { UploaderWithDataMimeType } from '../UploaderWithDataMimeType'
import { Fetcher } from '../../../Fetcher'
import { MimeType } from '../../../../../MimeType'

export class ResumableUploader extends UploaderWithDataMimeType<ResumableUploadRequest, Response> {
  private contentLength = 0
  private shouldUseMultipleRequests = false

  constructor(fetcher: Fetcher<Response>) {
    super(fetcher, 'resumable', false)
  }

  setContentLength(contentLength: number): ResumableUploader {
    this.contentLength = contentLength

    return this
  }

  setShouldUseMultipleRequests(shouldUseMultipleRequests: boolean): ResumableUploader {
    this.shouldUseMultipleRequests = shouldUseMultipleRequests

    return this
  }

  protected async _execute(): Promise<ResumableUploadRequest> {
    if (this.contentLength) {
      this.fetcher.appendHeader('X-Upload-Content-Length', this.contentLength.toString())
    }

    this.fetcher.appendHeader('X-Upload-Content-Type', this.dataMimeType)

    if (this.requestBody) {
      this.fetcher.setBody(this.requestBody as string, MimeType.JSON_UTF8)
    }

    const response = await this.fetcher.fetch()

    return new ResumableUploadRequest(
      this.contentLength,
      this.dataMimeType,
      this.fetcher.gDriveApi,
      response.headers.get('Location')!,
      this.shouldUseMultipleRequests
    )
  }
}
