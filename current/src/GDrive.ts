import type { IGDriveAccessParameters } from './api/types'

import { About } from './api/about'
import { Files } from './api/files'
import { PermissionApi } from './api/permissions'

export class GDrive implements IGDriveAccessParameters {
  // GDrive apis.
  public readonly about = new About(this)
  public readonly files = new Files(this)
  public readonly permissions = new PermissionApi(this)

  // Access parameters.
  public accessToken = ''
  public fetchTimeout = 1500
}
