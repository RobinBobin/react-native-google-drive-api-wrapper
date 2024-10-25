export class HttpError extends Error {
  readonly json: any
  readonly response: Response

  constructor(json: any, message: string, response: Response) {
    super(message)

    this.json = json
    this.response = response
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
