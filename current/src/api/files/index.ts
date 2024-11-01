import type { TBlobToByteArrayResultType } from 'aux/Fetcher/types'
import type { JsonObject, ReadonlyDeep } from 'type-fest'
import type { Uploader } from 'uploaders/base/Uploader'
import type {
  ICreateGetFetcherParams,
  ICreateIfNotExistsResultType,
  TListParams
} from './types'

import { Fetcher, fetchJson, fetchText } from 'aux/Fetcher'
import { isNonEmptyString } from 'aux/isNonEmptyString'
import { makeFilesUri } from 'aux/uriMakers'
import { MIME_TYPE_JSON } from 'src/constants'
import { MetadataOnlyUploader } from 'uploaders/implementations/MetadataOnlyUploader'
import { MultipartUploader } from 'uploaders/implementations/MultipartUploader'
import { ResumableUploader } from 'uploaders/implementations/ResumableUploader'
import { SimpleUploader } from 'uploaders/implementations/SimpleUploader'

import { GDriveApi } from '../GDriveApi'
import { UnexpectedFileCountError } from './errors/UnexpectedFileCountError'
import { ListQueryBuilder } from './ListQueryBuilder'

export class Files extends GDriveApi {
  copy(
    fileId: string,
    queryParameters?: JsonObject,
    requestBody: JsonObject = {}
  ): Promise<JsonObject> {
    return new Fetcher(this)
      .setBody(JSON.stringify(requestBody), MIME_TYPE_JSON)
      .setMethod('POST')
      .fetchJson(makeFilesUri({ fileId, method: 'copy', queryParameters }))
  }

  async createIfNotExists<ExecuteResultType>(
    queryParameters: ReadonlyDeep<TListParams>,
    uploader: ReadonlyDeep<Uploader<ExecuteResultType>>
  ): Promise<ICreateIfNotExistsResultType<ExecuteResultType | JsonObject>> {
    const list = await this.list(queryParameters)
    // eslint-disable-next-line dot-notation
    const files = list['files'] as JsonObject[]

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

  export(fileId: string, queryParameters: JsonObject): Promise<string> {
    return fetchText(
      this,
      makeFilesUri({ fileId, method: 'export', queryParameters })
    )
  }

  generateIds(queryParameters?: JsonObject): Promise<JsonObject> {
    return fetchJson(
      this,
      makeFilesUri({ method: 'generateIds', queryParameters })
    )
  }

  get(
    fileId: string,
    queryParameters?: JsonObject,
    range?: string
  ): Promise<Response> {
    return this.createGetFetcher({ fileId, queryParameters, range }).fetch()
  }

  getBinary(
    fileId: string,
    queryParameters?: JsonObject,
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
    queryParameters?: JsonObject,
    range?: string
  ): Promise<Response> {
    return this.createGetFetcher({
      fileId,
      isContent: true,
      queryParameters,
      range
    }).fetch()
  }

  geJsonObject<T = JsonObject>(
    fileId: string,
    queryParameters?: JsonObject
  ): Promise<T> {
    return this.createGetFetcher({
      fileId,
      isContent: true,
      queryParameters
    }).fetchJson<T>()
  }

  getMetadata(
    fileId: string,
    queryParameters?: JsonObject
  ): Promise<JsonObject> {
    return this.createGetFetcher({
      fileId,
      isContent: false,
      queryParameters
    }).fetchJson()
  }

  getText(
    fileId: string,
    queryParameters?: JsonObject,
    range?: string
  ): Promise<string> {
    return this.createGetFetcher({
      fileId,
      isContent: true,
      queryParameters,
      range
    }).fetchText()
  }

  list(queryParameters?: ReadonlyDeep<TListParams>): Promise<JsonObject> {
    const isListQueryBuilder = queryParameters?.q instanceof ListQueryBuilder

    const _queryParameters =
      isListQueryBuilder ?
        {
          ...queryParameters,
          q: queryParameters.q.toString()
        }
      : queryParameters

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
  }: Readonly<ICreateGetFetcherParams>): Fetcher {
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

    if (isNonEmptyString(range)) {
      fetcher.appendHeader('Range', `bytes=${range}`)
    }

    return fetcher
  }
}
