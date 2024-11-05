import type { TBlobToByteArrayResultType } from 'aux/Fetcher/types'
import type { JsonObject, ReadonlyDeep } from 'type-fest'
import type { Uploader } from 'uploaders/base/Uploader'
import type {
  ICreateGetFetcherParams,
  ICreateIfNotExistsResultType,
  IFileInput,
  IFileOutput,
  IFilesCopyQueryParameters,
  IFilesExportQueryParameters,
  IFilesGenerateIdsQueryParameters,
  IFilesGenerateIdsResultType,
  IFilesGetQueryParameters,
  IFilesListQueryParameters,
  IFilesListResultType
} from './types'

import { Fetcher, fetchJson, fetchText } from 'aux/Fetcher'
import { isNonEmptyString } from 'aux/helpers/isNonEmptyString'
import { FilesUriBuilder } from 'aux/uriBuilders/files/FilesUriBuilder'
import { processCommonQueryParameters } from 'aux/uriBuilders/files/processCommonQueryParameters'
import { processGetQueryParameters } from 'aux/uriBuilders/files/processGetQueryParameters'
import { processListQueryParameters } from 'aux/uriBuilders/files/processListQueryParameters'
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
    queryParameters?: ReadonlyDeep<IFilesCopyQueryParameters>,
    requestBody: IFileInput = {}
  ): Promise<IFileOutput> {
    return new Fetcher(this)
      .setBody(JSON.stringify(requestBody), MIME_TYPE_JSON)
      .setMethod('POST')
      .fetchJson(
        new FilesUriBuilder('copy')
          .setFileId(fileId)
          .build({ process: processCommonQueryParameters, queryParameters })
      )
  }

  async createIfNotExists<ExecuteResultType>(
    queryParameters: ReadonlyDeep<IFilesListQueryParameters>,
    uploader: ReadonlyDeep<Uploader<ExecuteResultType>>
  ): Promise<ICreateIfNotExistsResultType<ExecuteResultType | IFileOutput>> {
    const { files } = await this.list(queryParameters)

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
      .fetchText(new FilesUriBuilder().setFileId(fileId).build())
  }

  emptyTrash(): Promise<string> {
    return new Fetcher(this)
      .setMethod('DELETE')
      .fetchText(new FilesUriBuilder('trash').build())
  }

  export(
    fileId: string,
    queryParameters: ReadonlyDeep<IFilesExportQueryParameters>
  ): Promise<string> {
    return fetchText(
      this,
      new FilesUriBuilder('export').setFileId(fileId).build({ queryParameters })
    )
  }

  generateIds(
    queryParameters?: ReadonlyDeep<IFilesGenerateIdsQueryParameters>
  ): Promise<IFilesGenerateIdsResultType> {
    return fetchJson(
      this,
      new FilesUriBuilder('generateIds').build({ queryParameters })
    )
  }

  get(
    fileId: string,
    queryParameters?: ReadonlyDeep<IFilesGetQueryParameters>,
    range?: string
  ): Promise<Response> {
    return this.createGetFetcher({ fileId, queryParameters, range }).fetch()
  }

  getBinary(
    fileId: string,
    queryParameters?: ReadonlyDeep<IFilesGetQueryParameters>,
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
    queryParameters?: ReadonlyDeep<IFilesGetQueryParameters>,
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
    queryParameters?: ReadonlyDeep<IFilesGetQueryParameters>
  ): Promise<T> {
    return this.createGetFetcher({
      fileId,
      isContent: true,
      queryParameters
    }).fetchJson<T>()
  }

  getMetadata(
    fileId: string,
    queryParameters?: ReadonlyDeep<IFilesGetQueryParameters>
  ): Promise<IFileOutput> {
    return this.createGetFetcher({
      fileId,
      isContent: false,
      queryParameters
    }).fetchJson()
  }

  getText(
    fileId: string,
    queryParameters?: ReadonlyDeep<IFilesGetQueryParameters>,
    range?: string
  ): Promise<string> {
    return this.createGetFetcher({
      fileId,
      isContent: true,
      queryParameters,
      range
    }).fetchText()
  }

  list(
    queryParameters?: ReadonlyDeep<IFilesListQueryParameters>
  ): Promise<IFilesListResultType> {
    return fetchJson(
      this,
      new FilesUriBuilder().build({
        process: processListQueryParameters,
        queryParameters
      })
    )
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
  }: ReadonlyDeep<ICreateGetFetcherParams>): Fetcher {
    const fetcher = new Fetcher(this).setResource(
      new FilesUriBuilder().setFileId(fileId).build({
        process: processGetQueryParameters(isContent),
        queryParameters
      })
    )

    if (isNonEmptyString(range)) {
      fetcher.appendHeader('Range', `bytes=${range}`)
    }

    return fetcher
  }
}
