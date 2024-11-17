import type { JsonObject, ReadonlyDeep } from 'type-fest'

import { isError } from 'radashi'

class FetchResponseError extends Error {
  constructor(
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    readonly json: Readonly<JsonObject> | null,
    message: string,
    readonly response: ReadonlyDeep<Response>
  ) {
    super(message)
  }

  static async create(
    response: ReadonlyDeep<Response>
  ): Promise<FetchResponseError> {
    let message: string

    try {
      message = await FetchResponseError.getResponseText(response)
    } catch (error) {
      return error as FetchResponseError
    }

    let json: JsonObject | null = null

    try {
      json = JSON.parse(message) as JsonObject
    } catch (error) {
      // Nothing to do.
    }

    return new FetchResponseError(json, message, response)
  }

  private static async getResponseText(
    response: ReadonlyDeep<Response>
  ): Promise<string> {
    try {
      return await response.text()
    } catch (error) {
      let message: string

      if (isError(error)) {
        message = error.message
      } else {
        message =
          error?.toString?.() ??
          'Something insane happened when trying to `await response.text()`'
      }

      throw new FetchResponseError(null, message, response)
    }
  }
}

FetchResponseError.prototype.name = 'HttpError'

export { FetchResponseError }
