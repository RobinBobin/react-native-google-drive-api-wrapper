export default class HttpError extends Error {
  private __json?: any
  private __response: Response
  private __text?: string

  constructor(response: Response) {
    super()

    this.__response = response
  }

  static async create(response: Response) {
    const error = new HttpError(response)

    error.message = await response.text()
    error.text = error.message

    try {
      error.json = JSON.parse(error.text)
    } catch (error) {
      // Nothing to do.
    }

    return error
  }

  get json() {
    return this.__json
  }

  set json(json) {
    this.__json = json
  }

  get response() {
    return this.__response
  }

  get text() {
    return this.__text
  }

  set text(text) {
    this.__text = text
  }
}

HttpError.prototype.name = 'HttpError'
