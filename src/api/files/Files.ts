import FilesApi from './FilesApi'
import Fetcher, { FetchResponseType, fetch } from '../aux/Fetcher'
import MediaUploader from '../aux/uploaders/MediaUploader'
import MetadataOnlyUploader from '../aux/uploaders/MetadataOnlyUploader'
import MultipartUploader from '../aux/uploaders/MultipartUploader'
import ResumableUploader from '../aux/uploaders/ResumableUploader'
import Uploader from '../aux/uploaders/Uploader'
import Uris from '../aux/Uris'
import MimeTypes from '../../MimeTypes'
import UnexpectedFileCountError from '../../UnexpectedFileCountError'

export default class Files extends FilesApi {
  copy(fileId: string, queryParameters?: object, requestBody: object = {}) {
    return new Fetcher(this)
      .setBody(JSON.stringify(requestBody), MimeTypes.JSON)
      .setMethod('POST')
      .fetch(Uris.files({ fileId, method: 'copy', queryParameters }), 'json')
  }

  async createIfNotExists(
    queryParameters: object,
    uploader: Uploader,
  ): Promise<CreateIfNotExistsResult> {
    const files = (await this.list(queryParameters)).files

    if (!this.fetchRejectsOnHttpErrors && !files.ok) {
      return files
    }

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

  export(fileId: string, queryParameters: object) {
    return fetch(this, Uris.files({ fileId, method: 'export', queryParameters }), 'text')
  }

  generateIds(queryParameters?: object) {
    return fetch(this, Uris.files({ method: 'generateIds', queryParameters }), 'json')
  }

  get(fileId: string, queryParameters?: object, range?: string) {
    return this.__get(fileId, queryParameters, range)
  }

  getBinary(fileId: string, queryParameters?: object, range?: string) {
    return this.__getContent(fileId, queryParameters, range, 'blob')
  }

  getContent(fileId: string, queryParameters?: object, range?: string) {
    return this.__getContent(fileId, queryParameters, range)
  }

  getJson(fileId: string, queryParameters?: object) {
    return this.__getContent(fileId, queryParameters, undefined, 'json')
  }

  getMetadata(fileId: string, queryParameters?: object) {
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

  getText(fileId: string, queryParameters?: object, range?: string) {
    return this.__getContent(fileId, queryParameters, range, 'text')
  }

  list(queryParameters?: object) {
    let _queryParameters = queryParameters as { q: object | string }

    if (_queryParameters?.q && typeof _queryParameters.q !== 'string') {
      _queryParameters = {
        ..._queryParameters,
        q: _queryParameters.q.toString(),
      }
    }

    return fetch(this, Uris.files({ queryParameters: _queryParameters }), 'json')
  }

  newMediaUploader() {
    return new MediaUploader(new Fetcher(this))
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

  __get(
    fileId: string,
    queryParameters?: object,
    range?: string,
    responseType?: FetchResponseType,
  ) {
    const fetcher = new Fetcher(this)

    if (range) {
      fetcher.appendHeader('Range', `bytes=${range}`)
    }

    return fetcher.fetch(Uris.files({ fileId, queryParameters }), responseType)
  }

  __getContent(
    fileId: string,
    queryParameters?: object,
    range?: string,
    responseType?: FetchResponseType,
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

interface CreateIfNotExistsResult {
  alreadyExisted: boolean
  result: object
}
