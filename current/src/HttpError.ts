export class HttpError extends Error {
  constructor(
    readonly json: any,
    message: string,
    readonly response: Response
  ) {
    super(message)
  }

  static async create(response: Response) {
    const message = await response.text()
    let json: any

    try {
      json = JSON.parse(message)
    } catch (error) {
      // Nothing to do.
    }

    return new HttpError(json, message, response)
  }
}

HttpError.prototype.name = 'HttpError'
