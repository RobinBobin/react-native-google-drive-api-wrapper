import type { TBlobToByteArrayResultType } from 'aux/Fetcher/types'
import type { TJson, TQueryParameters } from 'src/types'
import type { Uploader } from 'uploaders/base/Uploader'
import type {
  ICreateGetFetcherParams,
  ICreateIfNotExistsResultType,
  TListParams
} from './types'

import { Fetcher, fetchJson, fetchText } from 'aux/Fetcher'
import { makeFilesUri } from 'aux/uriMakers'
import { MIME_TYPE_JSON } from 'src/constants'
import { MetadataOnlyUploader } from 'uploaders/implementations/MetadataOnlyUploader'
import { MultipartUploader } from 'uploaders/implementations/MultipartUploader'
import { ResumableUploader } from 'uploaders/implementations/ResumableUploader'
import { SimpleUploader } from 'uploaders/implementations/SimpleUploader'

import { GDriveApi } from '../GDriveApi'
import { UnexpectedFileCountError } from './errors/UnexpectedFileCountError'

export class Files extends GDriveApi {
  copy(
    fileId: string,
    queryParameters?: TQueryParameters,
    requestBody: TJson = {}
  ): Promise<TJson> {
    return new Fetcher(this)
      .setBody(JSON.stringify(requestBody), MIME_TYPE_JSON)
      .setMethod('POST')
      .fetchJson(makeFilesUri({ fileId, method: 'copy', queryParameters }))
  }

  async createIfNotExists<ExecuteResultType>(
    queryParameters: TListParams,
    uploader: Uploader<ExecuteResultType>
  ): Promise<ICreateIfNotExistsResultType<ExecuteResultType | TJson>> {
    const list = await this.list(queryParameters)
    // eslint-disable-next-line dot-notation
    const files = list['files'] as TJson[]

    if (!files.length) {
      return {
        alreadyExisted: false,
        result: await uploader.execute()
      }
    }

    const theOnlyOne = 1

    if (files.length === theOnlyOne) {
      if (!files[0]) {
        const somethingWeird = -1
        throw new UnexpectedFileCountError(somethingWeird)
      }

      return {
        alreadyExisted: true,
        result: files[0]
      }
    }

    throw new UnexpectedFileCountError(files.length)
  }

  delete(fileId: string): Promise<string> {
    return new Fetcher(this)
      .setMethod('DELETE')
      .fetchText(makeFilesUri({ fileId }))
  }

  emptyTrash(): Promise<string> {
    return new Fetcher(this)
      .setMethod('DELETE')
      .fetchText(makeFilesUri({ method: 'trash' }))
  }

  export(fileId: string, queryParameters: TQueryParameters): Promise<string> {
    return fetchText(
      this,
      makeFilesUri({ fileId, method: 'export', queryParameters })
    )
  }

  generateIds(queryParameters?: TQueryParameters): Promise<TJson> {
    return fetchJson(
      this,
      makeFilesUri({ method: 'generateIds', queryParameters })
    )
  }

  get(
    fileId: string,
    queryParameters?: TQueryParameters,
    range?: string
  ): Promise<Response> {
    return this.createGetFetcher({ fileId, queryParameters, range }).fetch()
  }

  getBinary(
    fileId: string,
    queryParameters?: TQueryParameters,
    range?: string
  ): Promise<TBlobToByteArrayResultType> {
    return this.createGetFetcher({
      fileId,
      isContent: true,
      queryParameters,
      range
    }).fetchBlob()
  }

  getContent(
    fileId: string,
    queryParameters?: TQueryParameters,
    range?: string
  ): Promise<Response> {
    return this.createGetFetcher({
      fileId,
      isContent: true,
      queryParameters,
      range
    }).fetch()
  }

  getJson<T = TJson>(
    fileId: string,
    queryParameters?: TQueryParameters
  ): Promise<T> {
    return this.createGetFetcher({
      fileId,
      isContent: true,
      queryParameters
    }).fetchJson<T>()
  }

  getMetadata(
    fileId: string,
    queryParameters?: TQueryParameters
  ): Promise<TJson> {
    return this.createGetFetcher({
      fileId,
      isContent: false,
      queryParameters
    }).fetchJson()
  }

  getText(
    fileId: string,
    queryParameters?: TQueryParameters,
    range?: string
  ): Promise<string> {
    return this.createGetFetcher({
      fileId,
      isContent: true,
      queryParameters,
      range
    }).fetchText()
  }

  list(queryParameters?: TListParams): Promise<TJson> {
    const _queryParameters =
      !queryParameters?.q ?
        queryParameters
      : {
          ...queryParameters,
          // eslint-disable-next-line id-length
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

  private createGetFetcher({
    fileId,
    isContent,
    queryParameters,
    range
  }: ICreateGetFetcherParams): Fetcher {
    const canSetAlt = typeof isContent === 'boolean'

    const _queryParameters =
      canSetAlt ?
        {
          ...queryParameters,
          alt: isContent ? 'media' : 'json'
        }
      : queryParameters

    const fetcher = new Fetcher(this).setResource(
      makeFilesUri({ fileId, queryParameters: _queryParameters })
    )

    if (range) {
      fetcher.appendHeader('Range', `bytes=${range}`)
    }

    return fetcher
  }
}
