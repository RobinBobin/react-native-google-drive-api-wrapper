import type { IFileInput, IFilesCreateQueryParameters } from 'api/files/types'
import type { Fetcher } from 'aux/Fetcher'
import type { ReadonlyDeep } from 'type-fest'
import type { TUploadType } from './types'

import { isNonEmptyString } from 'aux/helpers/isNonEmptyString'
import { FilesUriBuilder } from 'aux/uriBuilders/files/FilesUriBuilder'
import { processCreateQueryParameters } from 'uriBuilders/files/processCreateQueryParameters'

export abstract class Uploader<ExecuteResultType> {
  private idOfFileToUpdate?: string
  private _requestBody?: ReadonlyDeep<IFileInput>
  private queryParameters?: ReadonlyDeep<IFilesCreateQueryParameters>

  constructor(
    protected readonly fetcher: Readonly<Fetcher>,
    private readonly uploadType?: TUploadType
  ) {
    // Nothing to do.
  }

  execute(): Promise<ExecuteResultType> {
    const preDrivePath = this.uploadType ? 'upload' : undefined

    this.fetcher
      .setMethod(isNonEmptyString(this.idOfFileToUpdate) ? 'PATCH' : 'POST')
      .setResource(
        new FilesUriBuilder()
          .setFileId(this.idOfFileToUpdate)
          .setPreDrivePath(preDrivePath)
          .build({
            process: processCreateQueryParameters(this.uploadType),
            queryParameters: this.queryParameters
          })
      )

    return this._execute()
  }

  setIdOfFileToUpdate(fileId: string): this {
    this.idOfFileToUpdate = fileId

    return this
  }

  setQueryParameters(
    queryParameters: ReadonlyDeep<IFilesCreateQueryParameters>
  ): this {
    this.queryParameters = queryParameters

    return this
  }

  setRequestBody(requestBody: ReadonlyDeep<IFileInput>): this {
    this._requestBody = requestBody

    return this
  }

  protected abstract _execute(): Promise<ExecuteResultType>

  protected get requestBody(): string {
    return JSON.stringify(this._requestBody ?? {})
  }
}
