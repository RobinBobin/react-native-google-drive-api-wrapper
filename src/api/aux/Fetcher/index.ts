import { BodyType, FetchResponseType, FetchResultType } from './types'
import { blobToByteArray } from '../utils'
import { GDriveApi } from '../../GDriveApi'
import { HttpError } from '../../../HttpError'

/*
 * A weird workaround of an equally weird bug:
 *
 * Require cycle: node_modules/react-native/Libraries/Network/fetch.js -> node_modules/whatwg-fetch/dist/fetch.umd.js -> node_modules/react-native/Libraries/Network/fetch.js
 */

fetch

export class Fetcher {
  public readonly gDriveApi: GDriveApi

  private readonly abortController = new AbortController()
  private readonly init: RequestInit
  private resource?: RequestInfo
  private responseType?: FetchResponseType

  constructor(gDriveApi: GDriveApi) {
    this.init = {
      headers: new Headers(),
      signal: this.abortController.signal,
    }

    this.appendHeader('Authorization', `Bearer ${this.gDriveApi.accessParameters.accessToken}`)
  }

  appendHeader(name: string, value: string): Fetcher {
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

    if (this.gDriveApi.accessParameters.fetchTimeout >= 0) {
      setTimeout(() => this.abortController.abort(), this.gDriveApi.accessParameters.fetchTimeout)
    }

    let response: Response = await fetch(this.resource as RequestInfo, this.init)

    if (!response.ok) {
      throw await HttpError.create(response)
    }

    if (!this.responseType) {
      return response
    }

    const result = await response[this.responseType]()

    return this.responseType === 'blob' ? blobToByteArray(result) : result
  }

  setBody(body: BodyType, contentType?: string): Fetcher {
    this.init.body = body

    if (contentType) {
      this.appendHeader('Content-Length', body.length.toString())
      this.appendHeader('Content-Type', contentType)
    }

    return this
  }

  setMethod(method: string): Fetcher {
    this.init.method = method

    return this
  }

  setResource(resource: RequestInfo): Fetcher {
    this.resource = resource

    return this
  }

  setResponseType(responseType: FetchResponseType): Fetcher {
    this.responseType = responseType

    return this
  }
}

async function exportedFetch(
  gDriveApi: GDriveApi,
  resource: RequestInfo,
  responseType: FetchResponseType,
): FetchResultType {
  return new Fetcher(gDriveApi).fetch(resource, responseType)
}

export { exportedFetch as fetch }
