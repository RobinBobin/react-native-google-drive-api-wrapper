import { UploadType } from './types'
import { Fetcher } from '../Fetcher'
import { Uris } from '../Uris'

export abstract class Uploader<ExecuteResultType, FetcherResultType = ExecuteResultType> {
  protected readonly fetcher: Fetcher<FetcherResultType>
  protected requestBody?: string | object

  private idOfFileToUpdate?: string
  private readonly isJsonResponseType: boolean
  private queryParameters: { uploadType?: UploadType }

  constructor(
    fetcher: Fetcher<FetcherResultType>,
    uploadType?: UploadType,
    isJsonResponseType: boolean = true
  ) {
    this.fetcher = fetcher
    this.isJsonResponseType = isJsonResponseType
    this.queryParameters = { uploadType }
  }

  execute(): Promise<ExecuteResultType> {
    const isMetadataOnly = !this.queryParameters.uploadType

    this.requestBody = JSON.stringify(this.requestBody ?? {})

    this.fetcher.setMethod(this.idOfFileToUpdate ? 'PATCH' : 'POST').setResource(
      Uris.files({
        fileId: this.idOfFileToUpdate,
        preDrivePath: isMetadataOnly ? undefined : 'upload',
        queryParameters: this.queryParameters,
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

  setQueryParameters(queryParameters: object): Uploader<ExecuteResultType, FetcherResultType> {
    this.queryParameters = {
      ...queryParameters,
      uploadType: this.queryParameters.uploadType,
    }

    return this
  }

  setRequestBody(requestBody: object): Uploader<ExecuteResultType, FetcherResultType> {
    this.requestBody = requestBody

    return this
  }

  protected abstract _execute(): Promise<ExecuteResultType>
}
