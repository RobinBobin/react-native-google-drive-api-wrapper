import type { Fetcher } from 'aux/Fetcher'
import type { JsonObject } from 'type-fest'
import type { TUploadQueryParameters, TUploadType } from './types'

import { makeFilesUri } from 'aux/uriMakers'

export abstract class Uploader<ExecuteResultType> {
  private idOfFileToUpdate = ''
  private _requestBody = {}
  private queryParameters = {}

  constructor(
    protected readonly fetcher: Readonly<Fetcher>,
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

  setIdOfFileToUpdate(fileId: string): this {
    this.idOfFileToUpdate = fileId

    return this
  }

  setQueryParameters(queryParameters: TUploadQueryParameters): this {
    this.queryParameters = queryParameters

    return this
  }

  setRequestBody(requestBody: JsonObject): this {
    this._requestBody = requestBody

    return this
  }

  protected abstract _execute(): Promise<ExecuteResultType>

  protected get requestBody(): string {
    return JSON.stringify(this._requestBody)
  }
}
