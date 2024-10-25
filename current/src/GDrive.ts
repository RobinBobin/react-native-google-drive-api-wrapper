import { About } from './api/about/About'
import { Files } from './api/files'
import { Permissions } from './api/permissions/Permissions'

export class GDrive {
  // GDrive apis.
  public readonly about = new About(this)
  public readonly files = new Files(this)
  public readonly permissions = new Permissions(this)

  // Access parameters.
  public accessToken = ''
  public fetchTimeout = 1500
}
