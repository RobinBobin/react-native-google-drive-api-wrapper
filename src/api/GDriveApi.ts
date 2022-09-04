export class GDriveApi {
  private __accessToken = ''
  private __fetchTimeout = 1500

  get accessToken() {
    return this.__accessToken
  }

  set accessToken(accessToken) {
    this.__accessToken = accessToken
  }

  get fetchTimeout() {
    return this.__fetchTimeout
  }

  set fetchTimeout(fetchTimeout) {
    this.__fetchTimeout = fetchTimeout
  }
}
