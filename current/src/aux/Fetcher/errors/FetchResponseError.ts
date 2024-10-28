import type { TJson } from 'src/types'

export class FetchResponseError extends Error {
  constructor(
    readonly json: TJson | null,
    message: string,
    readonly response: Response
  ) {
    super(message)
  }

  static async create(response: Response): Promise<FetchResponseError> {
    let message = ''

    try {
      message = await FetchResponseError.getResponseText(response)
    } catch (error) {
      return error as FetchResponseError
    }

    let json: TJson | null = null

    try {
      json = JSON.parse(message)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // Nothing to do.
    }

    return new FetchResponseError(json, message, response)
  }

  private static async getResponseText(response: Response): Promise<string> {
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
