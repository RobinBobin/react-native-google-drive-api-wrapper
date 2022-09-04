export default class GDriveApi {
  private __accessToken: string = ''
  private __fetchCoercesTypes: boolean
  private __fetchRejectsOnHttpErrors: boolean
  private __fetchTimeout: number

  constructor() {
    this.__fetchCoercesTypes = true
    this.__fetchRejectsOnHttpErrors = true
    this.__fetchTimeout = 1500
  }

  get accessToken() {
    return this.__accessToken
  }

  set accessToken(accessToken) {
    this.__accessToken = accessToken
  }

  get fetchCoercesTypes() {
    return this.__fetchCoercesTypes
  }

  set fetchCoercesTypes(fetchCoercesTypes) {
    this.__fetchCoercesTypes = fetchCoercesTypes
  }

  get fetchRejectsOnHttpErrors() {
    return this.__fetchRejectsOnHttpErrors
  }

  set fetchRejectsOnHttpErrors(fetchRejectsOnHttpErrors) {
    this.__fetchRejectsOnHttpErrors = fetchRejectsOnHttpErrors
  }

  get fetchTimeout() {
    return this.__fetchTimeout
  }

  set fetchTimeout(fetchTimeout) {
    this.__fetchTimeout = fetchTimeout
  }
}
