export class HttpError extends Error {
  constructor(
    readonly json: Record<string, unknown> | null,
    message: string,
    readonly response: Response
  ) {
    super(message)
  }

  static async create(response: Response): Promise<HttpError> {
    let message = ''

    try {
      message = await HttpError.getResponseText(response)
    } catch (error) {
      return error as HttpError
    }

    let json: Record<string, unknown> | null = null

    try {
      json = JSON.parse(message)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // Nothing to do.
    }

    return new HttpError(json, message, response)
  }

  private static async getResponseText(response: Response): Promise<string> {
    try {
      return await response.text()
    } catch (error) {
      let message = "Something insane happened when trying to 'await response.text()'"

      if (error instanceof Error) {
        message = error.message
      } else if (typeof error === 'object') {
        message = error?.toString() ?? message
      }

      throw new HttpError(null, message, response)
    }
  }
}

HttpError.prototype.name = 'HttpError'
