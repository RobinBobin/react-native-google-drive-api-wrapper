import type { TUploadQueryParameters, TUploadType } from './types'
import { Fetcher } from 'aux/Fetcher'
import { makeFilesUri } from 'aux/uriMakers'
import type { TJson } from 'src/types'

export abstract class Uploader<ExecuteResultType> {
  private idOfFileToUpdate = ''
  private _requestBody = {}
  private queryParameters = {}

  constructor(
    protected readonly fetcher: Fetcher,
    private readonly uploadType?: TUploadType
  ) {
    // Nothing to do.
  }

  execute(): Promise<ExecuteResultType> {
    const isMetadataOnly = !this.uploadType
    const preDrivePath = isMetadataOnly ? undefined : 'upload'

    this.fetcher
      .setMethod(this.idOfFileToUpdate ? 'PATCH' : 'POST')
      .setResource(
        makeFilesUri({
          fileId: this.idOfFileToUpdate,
          preDrivePath,
          queryParameters: {
            ...this.queryParameters,
            uploadType: this.uploadType
          }
        })
      )

    return this._execute()
  }

  setIdOfFileToUpdate(fileId: string): Uploader<ExecuteResultType> {
    this.idOfFileToUpdate = fileId

    return this
  }

  setQueryParameters(
    queryParameters: TUploadQueryParameters
  ): Uploader<ExecuteResultType> {
    this.queryParameters = queryParameters

    return this
  }

  setRequestBody(requestBody: TJson): Uploader<ExecuteResultType> {
    this._requestBody = requestBody

    return this
  }

  protected abstract _execute(): Promise<ExecuteResultType>

  protected get requestBody(): string {
    return JSON.stringify(this._requestBody)
  }
}
