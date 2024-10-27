import type { TUploadType } from './types'
import { Fetcher } from '../Fetcher'
import { makeFilesUri } from '../Uris'
import type { TGenericQueryParameters } from '../Uris/types'

type TQueryParameters = TGenericQueryParameters & { uploadType?: never }

export abstract class Uploader<ExecuteResultType, FetcherResultType = ExecuteResultType> {
  protected requestBody: string | Record<string, unknown> = {}

  private idOfFileToUpdate = ''
  private queryParameters = {}

  constructor(
    protected readonly fetcher: Fetcher<FetcherResultType>,
    private readonly uploadType?: TUploadType,
    private readonly isJsonResponseType = true
  ) {
    // Nothing to do.
  }

  execute(): Promise<ExecuteResultType> {
    const isMetadataOnly = !this.uploadType

    this.requestBody = JSON.stringify(this.requestBody)

    this.fetcher.setMethod(this.idOfFileToUpdate ? 'PATCH' : 'POST').setResource(
      makeFilesUri({
        fileId: this.idOfFileToUpdate,
        preDrivePath: isMetadataOnly ? undefined : 'upload',
        queryParameters: {
          ...this.queryParameters,
          uploadType: this.uploadType
        }
      }),
    )

    if (this.isJsonResponseType) {
      this.fetcher.setResponseType('json')
    }

    return this._execute()
  }

  setIdOfFileToUpdate(fileId: string): Uploader<ExecuteResultType, FetcherResultType> {
    this.idOfFileToUpdate = fileId

    return this
  }

  setQueryParameters(queryParameters: TQueryParameters): Uploader<ExecuteResultType, FetcherResultType> {
    this.queryParameters = { ...queryParameters }

    return this
  }

  setRequestBody(requestBody: Record<string, unknown>): Uploader<ExecuteResultType, FetcherResultType> {
    this.requestBody = requestBody

    return this
  }

  protected abstract _execute(): Promise<ExecuteResultType>
}
