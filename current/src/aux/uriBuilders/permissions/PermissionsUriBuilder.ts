import { BaseUriBuilder } from '../BaseUriBuilder'

export class PermissionsUriBuilder extends BaseUriBuilder {
  constructor(fileId: string, permissionId?: string) {
    super('files')

    const path = ['permissions', permissionId].filter(Boolean).join('/')

    this.setFileId(fileId).setPath(path)
  }
}
