import { Data, UploadType } from './types'
import { Fetcher } from '../../Fetcher'
import { FetchResultType } from '../../Fetcher/types'
import { Uris } from '../../Uris'
import { FilesApi } from '../../../files/FilesApi'

export abstract class Uploader {
  protected data?: Data
  protected readonly fetcher: Fetcher<FilesApi>
  protected mimeType?: string
  protected requestBody?: string | object

  private idOfFileToUpdate?: string
  private readonly isJsonResponseType: boolean
  private queryParameters: { uploadType?: UploadType }

  constructor(
    fetcher: Fetcher<FilesApi>,
    uploadType?: UploadType,
    isJsonResponseType: boolean = true
  ) {
    this.fetcher = fetcher
    this.isJsonResponseType = isJsonResponseType
    this.queryParameters = { uploadType }
  }

  execute(): FetchResultType {
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

  setData(data: Data, mimeType: string): Uploader {
    this.data = data
    this.mimeType = mimeType

    return this
  }

  setIdOfFileToUpdate(fileId: string): Uploader {
    this.idOfFileToUpdate = fileId

    return this
  }

  setQueryParameters(queryParameters: object): Uploader {
    this.queryParameters = {
      ...queryParameters,
      uploadType: this.queryParameters.uploadType,
    }

    return this
  }

  setRequestBody(requestBody: object): Uploader {
    this.requestBody = requestBody

    return this
  }

  protected abstract _execute(): FetchResultType
}
