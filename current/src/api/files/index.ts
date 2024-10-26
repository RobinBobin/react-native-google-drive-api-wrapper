import { UnexpectedFileCountError } from './UnexpectedFileCountError'
import type { ICreateIfNotExistsResultType, TListParams } from './types'
import { GDriveApi } from '../GDriveApi'
import { Fetcher, fetch } from '../aux/Fetcher'
import type { TFetchResponseType } from '../aux/Fetcher/types'
import { MetadataOnlyUploader } from '../aux/uploaders/MetadataOnlyUploader'
import { Uploader } from '../aux/uploaders/Uploader'
import { MultipartUploader } from '../aux/uploaders/withdata/MultipartUploader'
import { SimpleUploader } from '../aux/uploaders/withdata/SimpleUploader'
import { ResumableUploader } from '../aux/uploaders/withdatamimetype/ResumableUploader'
import { Uris } from '../aux/Uris'
import { MimeType } from '../../MimeType'
import type { TGenericQueryParameters } from '../aux/Uris/types'

export class Files extends GDriveApi {
  copy(fileId: string, queryParameters?: TGenericQueryParameters, requestBody: Record<string, unknown> = {}) {
    return new Fetcher(this)
      .setBody(JSON.stringify(requestBody), MimeType.JSON)
      .setMethod('POST')
      .fetch(Uris.files({ fileId, method: 'copy', queryParameters }), 'json')
  }

  async createIfNotExists<ExecuteResultType, FetcherResultType = ExecuteResultType>(
    queryParameters: TListParams,
    uploader: Uploader<ExecuteResultType, FetcherResultType>
  ): Promise<ICreateIfNotExistsResultType<ExecuteResultType>> {
    const files = (await this.list(queryParameters)).files

    switch (files.length) {
      case 0:
        return {
          alreadyExisted: false,
          result: await uploader.execute(),
        }

      case 1:
        return {
          alreadyExisted: true,
          result: files[0],
        }

      default:
        throw new UnexpectedFileCountError([0, 1], files.length)
    }
  }

  delete(fileId: string) {
    return new Fetcher(this).setMethod('DELETE').fetch(Uris.files({ fileId }), 'text')
  }

  emptyTrash() {
    return new Fetcher(this).setMethod('DELETE').fetch(Uris.files({ method: 'trash' }), 'text')
  }

  export(fileId: string, queryParameters: TGenericQueryParameters) {
    return fetch(this, Uris.files({ fileId, method: 'export', queryParameters }), 'text')
  }

  generateIds(queryParameters?: TGenericQueryParameters) {
    return fetch(this, Uris.files({ method: 'generateIds', queryParameters }), 'json')
  }

  get(fileId: string, queryParameters?: TGenericQueryParameters, range?: string) {
    return this.__get(fileId, queryParameters, range)
  }

  getBinary(fileId: string, queryParameters?: TGenericQueryParameters, range?: string) {
    return this.__getContent(fileId, queryParameters, range, 'blob')
  }

  getContent(fileId: string, queryParameters?: TGenericQueryParameters, range?: string) {
    return this.__getContent(fileId, queryParameters, range)
  }

  getJson(fileId: string, queryParameters?: TGenericQueryParameters) {
    return this.__getContent(fileId, queryParameters, undefined, 'json')
  }

  getMetadata(fileId: string, queryParameters?: TGenericQueryParameters) {
    return this.__get(
      fileId,
      {
        ...queryParameters,
        alt: 'json',
      },
      undefined,
      'json',
    )
  }

  getText(fileId: string, queryParameters?: TGenericQueryParameters, range?: string) {
    return this.__getContent(fileId, queryParameters, range, 'text')
  }

  list(queryParameters?: TListParams) {
    const _queryParameters = !queryParameters?.q ? queryParameters : {
      ...queryParameters,
      q: queryParameters.q.toString()
    }

    return fetch<any>(this, Uris.files({ queryParameters: _queryParameters }), 'json')
  }

  newMetadataOnlyUploader() {
    return new MetadataOnlyUploader(new Fetcher(this))
  }

  newMultipartUploader() {
    return new MultipartUploader(new Fetcher(this))
  }

  newResumableUploader() {
    return new ResumableUploader(new Fetcher(this))
  }

  newSimpleUploader() {
    return new SimpleUploader(new Fetcher(this))
  }

  __get(
    fileId: string,
    queryParameters?: TGenericQueryParameters,
    range?: string,
    responseType?: TFetchResponseType,
  ) {
    const fetcher = new Fetcher(this)

    if (range) {
      fetcher.appendHeader('Range', `bytes=${range}`)
    }

    return fetcher.fetch(Uris.files({ fileId, queryParameters }), responseType)
  }

  __getContent(
    fileId: string,
    queryParameters?: TGenericQueryParameters,
    range?: string,
    responseType?: TFetchResponseType,
  ) {
    return this.__get(
      fileId,
      {
        ...queryParameters,
        alt: 'media',
      },
      range,
      responseType,
    )
  }
}
