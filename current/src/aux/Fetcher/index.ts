import type { TBlobToByteArrayResultType, TBodyType } from './types'
import { blobToByteArray } from './blobToByteArray'
import { FetchResponseError } from './errors/FetchResponseError'
import type { GDriveApi } from 'api/GDriveApi'
import type { TJson } from 'src/types'

export class Fetcher {
  private readonly abortController = new AbortController()
  private readonly init: RequestInit
  private resource: RequestInfo = ''

  constructor(public readonly gDriveApi: GDriveApi) {
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

  async fetch(resource?: RequestInfo): Promise<Response> {
    if (resource) {
      this.setResource(resource)
    }

    if (this.gDriveApi.accessParameters.fetchTimeout >= 0) {
      setTimeout(() => this.abortController.abort(), this.gDriveApi.accessParameters.fetchTimeout)
    }

    const response: Response = await fetch(this.resource, this.init)

    if (response.ok) {
      return response
    }

    throw await FetchResponseError.create(response)
  }

  async fetchBlob(resource?: RequestInfo): Promise<TBlobToByteArrayResultType> {
    const response = await this.fetch(resource)

    return blobToByteArray(await response.blob())
  }

  async fetchText(resource?: RequestInfo): Promise<string> {
    const response = await this.fetch(resource)

    return await response.text()
  }

  async fetchJson<T = TJson>(resource?: RequestInfo): Promise<T> {
    const response = await this.fetch(resource)

    return await response.json()
  }

  setBody(body: TBodyType, contentType?: string): Fetcher {
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
}

export const fetchBlob = (gDriveApi: GDriveApi, resource: RequestInfo): Promise<TBlobToByteArrayResultType> => {
  return new Fetcher(gDriveApi).fetchBlob(resource)
}

export const fetchText = (gDriveApi: GDriveApi, resource: RequestInfo): Promise<string> => {
  return new Fetcher(gDriveApi).fetchText(resource)
}

export const fetchJson = <T = TJson>(gDriveApi: GDriveApi, resource: RequestInfo): Promise<T> => {
  return new Fetcher(gDriveApi).fetchJson<T>(resource)
}
