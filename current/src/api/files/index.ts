import type { JsonObject, ReadonlyDeep } from 'type-fest'
import type { TBlobToByteArrayResultType } from '../../aux/Fetcher/types'
import type { Uploader } from '../../aux/uploaders/base/Uploader'
import type {
  ICreateGetFetcherParams,
  ICreateIfNotExistsResultType,
  IFileOutput,
  IFilesCopyParameters,
  IFilesExportQueryParameters,
  IFilesGenerateIdsQueryParameters,
  IFilesGenerateIdsResultType,
  IFilesGetParameters,
  IFilesGetQueryParameters,
  IFilesListQueryParameters,
  IFilesListResultType
} from './types'

import { mimeTypes } from '@robinbobin/mimetype-constants'

import { fetchBlob, Fetcher, fetchJson } from '../../aux/Fetcher'
import { isNonEmptyString } from '../../aux/helpers/isNonEmptyString'
import { MetadataOnlyUploader } from '../../aux/uploaders/implementations/MetadataOnlyUploader'
import { MultipartUploader } from '../../aux/uploaders/implementations/MultipartUploader'
import { ResumableUploader } from '../../aux/uploaders/implementations/ResumableUploader'
import { SimpleUploader } from '../../aux/uploaders/implementations/SimpleUploader'
import { FilesUriBuilder } from '../../aux/uriBuilders/files/FilesUriBuilder'
import { processCommonQueryParameters } from '../../aux/uriBuilders/files/processCommonQueryParameters'
import { processGetQueryParameters } from '../../aux/uriBuilders/files/processGetQueryParameters'
import { processListQueryParameters } from '../../aux/uriBuilders/files/processListQueryParameters'
import { GDriveApi } from '../GDriveApi'
import { UnexpectedFileCountError } from './errors/UnexpectedFileCountError'

export class Files extends GDriveApi {
  copy(
    fileId: string,
    parameters?: ReadonlyDeep<IFilesCopyParameters>
  ): Promise<IFileOutput> {
    return new Fetcher(this)
      .setBody(
        JSON.stringify(parameters?.requestBody ?? {}),
        mimeTypes.application.json
      )
      .setMethod('POST')
      .fetchJson(
        new FilesUriBuilder('copy').setFileId(fileId).build({
          process: processCommonQueryParameters,
          queryParameters: parameters?.queryParameters
        })
      )
  }

  async createIfNotExists<ExecuteResultType>(
    queryParameters: ReadonlyDeep<IFilesListQueryParameters>,
    uploader: ReadonlyDeep<Uploader<ExecuteResultType>>
  ): Promise<ICreateIfNotExistsResultType<ExecuteResultType>> {
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
        result: files[0] as ExecuteResultType
      }
    }

    throw new UnexpectedFileCountError(files.length)
  }

  async delete(fileId: string): Promise<void> {
    await new Fetcher(this)
      .setMethod('DELETE')
      .fetchText(new FilesUriBuilder().setFileId(fileId).build())
  }

  async emptyTrash(): Promise<void> {
    await new Fetcher(this)
      .setMethod('DELETE')
      .fetchText(new FilesUriBuilder('trash').build())
  }

  export(
    fileId: string,
    queryParameters: ReadonlyDeep<IFilesExportQueryParameters>
  ): Promise<TBlobToByteArrayResultType> {
    return fetchBlob(
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
    parameters?: ReadonlyDeep<IFilesGetParameters>
  ): Promise<Response> {
    return this.createGetFetcher({
      ...(parameters as Required<IFilesGetParameters>),
      fileId
    }).fetch()
  }

  getBinary(
    fileId: string,
    parameters?: ReadonlyDeep<IFilesGetParameters>
  ): Promise<TBlobToByteArrayResultType> {
    return this.createGetFetcher({
      ...(parameters as Required<IFilesGetParameters>),
      fileId,
      isContent: true
    }).fetchBlob()
  }

  getContent(
    fileId: string,
    parameters?: ReadonlyDeep<IFilesGetParameters>
  ): Promise<Response> {
    return this.createGetFetcher({
      ...(parameters as Required<IFilesGetParameters>),
      fileId,
      isContent: true
    }).fetch()
  }

  getJson<T = JsonObject>(
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
    parameters?: ReadonlyDeep<IFilesGetParameters>
  ): Promise<string> {
    return this.createGetFetcher({
      ...(parameters as Required<IFilesGetParameters>),
      fileId,
      isContent: true
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
