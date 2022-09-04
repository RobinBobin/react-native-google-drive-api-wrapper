import { blobToByteArray } from './utils'
import GDriveApi from '../GDriveApi'
import HttpError from '../../HttpError'

/*
 * A weird workaround of an equally weird bug:
 *
 * Require cycle: node_modules/react-native/Libraries/Network/fetch.js -> node_modules/whatwg-fetch/dist/fetch.umd.js -> node_modules/react-native/Libraries/Network/fetch.js
 */

fetch

export type BodyType = Uint8Array | string
export type FetchResponseType = 'blob' | 'json' | 'text'
export type FetchResultType = Promise<any>

export default class Fetcher<SomeGDriveApi extends GDriveApi> {
  private readonly abortController: AbortController
  private readonly fetchRejectsOnHttpErrors: boolean
  private readonly __gDriveApi: SomeGDriveApi
  private readonly init: RequestInit
  private resource?: RequestInfo
  private responseType?: FetchResponseType

  constructor(gDriveApi: SomeGDriveApi, fetchRejectsOnHttpErrors?: boolean) {
    this.abortController = new AbortController()
    this.fetchRejectsOnHttpErrors = fetchRejectsOnHttpErrors ?? gDriveApi.fetchRejectsOnHttpErrors
    this.__gDriveApi = gDriveApi

    this.init = {
      headers: new Headers(),
      signal: this.abortController.signal,
    }

    this.appendHeader('Authorization', `Bearer ${this.gDriveApi.accessToken}`)
  }

  appendHeader(name: string, value: string): Fetcher<SomeGDriveApi> {
    ;(this.init.headers as Headers).append(name, value)

    return this
  }

  async fetch(resource?: RequestInfo, responseType?: FetchResponseType): FetchResultType {
    if (resource) {
      this.setResource(resource)
    }

    if (responseType) {
      this.setResponseType(responseType)
    }

    if (this.gDriveApi.fetchTimeout >= 0) {
      setTimeout(() => this.abortController.abort(), this.gDriveApi.fetchTimeout)
    }

    let response: Response = await fetch(this.resource as RequestInfo, this.init)

    if (!response.ok) {
      if (this.fetchRejectsOnHttpErrors) {
        throw await HttpError.create(response)
      }

      return response
    }

    if (!(this.gDriveApi.fetchCoercesTypes && this.responseType)) {
      return response
    }

    const result = await response[this.responseType]()

    return this.responseType === 'blob' ? blobToByteArray(result) : result
  }

  get gDriveApi() {
    return this.__gDriveApi
  }

  setBody(body: BodyType, contentType?: string): Fetcher<SomeGDriveApi> {
    this.init.body = body

    if (contentType) {
      this.appendHeader('Content-Length', body.length.toString())
      this.appendHeader('Content-Type', contentType)
    }

    return this
  }

  setMethod(method: string): Fetcher<SomeGDriveApi> {
    this.init.method = method

    return this
  }

  setResource(resource: RequestInfo): Fetcher<SomeGDriveApi> {
    this.resource = resource

    return this
  }

  setResponseType(responseType: FetchResponseType): Fetcher<SomeGDriveApi> {
    this.responseType = responseType

    return this
  }
}

async function exportedFetch<SomeGDriveApi extends GDriveApi>(
  gDriveApi: SomeGDriveApi,
  resource: RequestInfo,
  responseType: FetchResponseType,
): FetchResultType {
  return new Fetcher(gDriveApi).fetch(resource, responseType)
}

export { exportedFetch as fetch }
