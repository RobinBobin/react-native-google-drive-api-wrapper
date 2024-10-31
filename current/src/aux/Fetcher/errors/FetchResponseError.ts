import type { TJson } from 'src/types'
import type { ReadonlyDeep } from 'type-fest'

class FetchResponseError extends Error {
  constructor(
    readonly json: Readonly<TJson> | null,
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

    let json: TJson | null = null

    try {
      json = JSON.parse(message) as TJson
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
      let message =
        "Something insane happened when trying to 'await response.text()'"

      if (error instanceof Error) {
        message = error.message
      } else if (typeof error === 'object') {
        message = error?.toString() ?? message
      }

      throw new FetchResponseError(null, message, response)
    }
  }
}

FetchResponseError.prototype.name = 'HttpError'

export { FetchResponseError }
