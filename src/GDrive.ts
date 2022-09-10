import { About } from './api/about/About'
import { Files } from './api/files'
import { Permissions } from './api/permissions/Permissions'

export class GDrive {
  // GDrive apis.
  public readonly about = new About(this)
  public readonly files = new Files(this)
  public readonly permissions = new Permissions(this)

  // Access parameters.
  private __accessToken = ''
  private __fetchTimeout = 1500

  get accessToken() {
    return this.__accessToken
  }

  set accessToken(accessToken: string) {
    this.__accessToken = accessToken
  }

  get fetchTimeout() {
    return this.__fetchTimeout
  }

  set fetchTimeout(fetchTimeout: number) {
    this.__fetchTimeout = fetchTimeout
  }
}
