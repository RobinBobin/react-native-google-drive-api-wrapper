import Fetcher, { FetchResultType } from '../Fetcher'
import Uris from '../Uris'
import FilesApi from '../../files/FilesApi'

export type DataType = Uint8Array | number[] | string

type UploadType = 'media' | 'multipart' | 'resumable'

export default abstract class Uploader {
  protected data?: DataType
  protected dataType?: string
  protected isBase64?: boolean
  protected requestBody?: string | object

  private idOfFileToUpdate?: string
  private queryParameters: { uploadType: UploadType | undefined }

  constructor(
    protected readonly fetcher: Fetcher<FilesApi>,
    uploadType?: UploadType,
    private readonly isJsonResponseType: boolean = true,
  ) {
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

  setData(data: DataType, dataType: string): Uploader {
    this.data = data
    this.dataType = dataType

    return this
  }

  setIdOfFileToUpdate(fileId: string): Uploader {
    this.idOfFileToUpdate = fileId

    return this
  }

  setIsBase64(isBase64: boolean): Uploader {
    this.isBase64 = isBase64

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
