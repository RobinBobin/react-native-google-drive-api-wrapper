import { UnexpectedFileCountError } from './errors/UnexpectedFileCountError'
import type { ICreateIfNotExistsResultType, ICreateGetFetcherParams, TListParams } from './types'
import { GDriveApi } from '../GDriveApi'
import { Fetcher, fetchJson, fetchText } from 'aux/Fetcher'
import { MetadataOnlyUploader } from 'uploaders/implementations/MetadataOnlyUploader'
import { Uploader } from 'uploaders/base/Uploader'
import { MultipartUploader } from 'uploaders/implementations/MultipartUploader'
import { SimpleUploader } from 'uploaders/implementations/SimpleUploader'
import { ResumableUploader } from 'uploaders/implementations/ResumableUploader'
import { makeFilesUri } from 'aux/uriMakers'
import { MimeType } from 'src/MimeType'
import type { TQueryParameters } from 'src/types'
import type { TJson } from 'src/types'
import type { TBlobToByteArrayResultType } from 'aux/Fetcher/types'

export class Files extends GDriveApi {
  copy(fileId: string, queryParameters?: TQueryParameters, requestBody: TJson = {}): Promise<TJson> {
    return new Fetcher(this)
      .setBody(JSON.stringify(requestBody), MimeType.JSON)
      .setMethod('POST')
      .fetchJson(makeFilesUri({ fileId, method: 'copy', queryParameters }))
  }

  async createIfNotExists<ExecuteResultType>(
    queryParameters: TListParams,
    uploader: Uploader<ExecuteResultType>
  ): Promise<ICreateIfNotExistsResultType<ExecuteResultType | TJson>> {
    const list = await this.list(queryParameters)
    const files = list['files'] as TJson[]

    if (!files.length) {
      return {
        alreadyExisted: false,
        result: await uploader.execute(),
      }
    }

    if (files.length === 1) {
      return {
        alreadyExisted: true,
        result: files[0] as TJson,
      }
    }

    throw new UnexpectedFileCountError(files.length)
  }

  delete(fileId: string): Promise<string> {
    return new Fetcher(this).setMethod('DELETE').fetchText(makeFilesUri({ fileId }))
  }

  emptyTrash(): Promise<string> {
    return new Fetcher(this).setMethod('DELETE').fetchText(makeFilesUri({ method: 'trash' }))
  }

  export(fileId: string, queryParameters: TQueryParameters): Promise<string> {
    return fetchText(this, makeFilesUri({ fileId, method: 'export', queryParameters }))
  }

  generateIds(queryParameters?: TQueryParameters): Promise<TJson> {
    return fetchJson(this, makeFilesUri({ method: 'generateIds', queryParameters }))
  }

  get(fileId: string, queryParameters?: TQueryParameters, range?: string): Promise<Response> {
    return this.createGetFetcher({ fileId, queryParameters, range }).fetch()
  }

  getBinary(fileId: string, queryParameters?: TQueryParameters, range?: string): Promise<TBlobToByteArrayResultType> {
    return this.createGetFetcher({ fileId, isContent: true, queryParameters, range}).fetchBlob()
  }

  getContent(fileId: string, queryParameters?: TQueryParameters, range?: string): Promise<Response> {
    return this.createGetFetcher({ fileId, isContent: true, queryParameters, range}).fetch()
  }

  getJson<T = TJson>(fileId: string, queryParameters?: TQueryParameters): Promise<T> {
    return this.createGetFetcher({ fileId, isContent: true, queryParameters }).fetchJson<T>()
  }

  getMetadata(fileId: string, queryParameters?: TQueryParameters): Promise<TJson> {
    return this.createGetFetcher({ fileId, isContent: false, queryParameters }).fetchJson()
  }

  getText(fileId: string, queryParameters?: TQueryParameters, range?: string): Promise<string> {
    return this.createGetFetcher({ fileId, isContent: true, queryParameters, range }).fetchText()
  }

  list(queryParameters?: TListParams): Promise<TJson> {
    const _queryParameters = !queryParameters?.q ? queryParameters : {
      ...queryParameters,
      q: queryParameters.q.toString()
    }

    return fetchJson(this, makeFilesUri({ queryParameters: _queryParameters }))
  }

  newMetadataOnlyUploader(): MetadataOnlyUploader {
    return new MetadataOnlyUploader(new Fetcher(this))
  }

  newMultipartUploader(): MultipartUploader {
    return new MultipartUploader(new Fetcher(this))
  }

  newResumableUploader(): ResumableUploader {
    return new ResumableUploader(new Fetcher(this))
  }

  newSimpleUploader(): SimpleUploader {
    return new SimpleUploader(new Fetcher(this))
  }

  private createGetFetcher({ fileId, isContent, queryParameters, range }: ICreateGetFetcherParams): Fetcher {
    const canSetAlt = typeof isContent === 'boolean'

    const _queryParameters = canSetAlt ? {
      ...queryParameters,
      alt: isContent ? 'media' : 'json'
    } : queryParameters

    const fetcher = new Fetcher(this).setResource(makeFilesUri({ fileId, queryParameters: _queryParameters }))

    if (range) {
      fetcher.appendHeader('Range', `bytes=${range}`)
    }

    return fetcher
  }
}
