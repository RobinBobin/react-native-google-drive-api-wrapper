import { About } from './api/about/About'
import { Files } from './api/files'
import { GDriveApi } from './api/GDriveApi'
import { Permissions } from './api/permissions/Permissions'

export class GDrive {
  private readonly __apis = new Map<string, GDriveApi>()

  constructor() {
    this.about = new About()
    this.files = new Files()
    this.permissions = new Permissions()
  }

  get about() {
    return this.__apis.get('about') as About
  }

  set about(about: About) {
    this.__setApi(about, 'about')
  }

  get accessToken() {
    return this.__apis.values().next().value.accessToken
  }

  set accessToken(accessToken) {
    for (const api of this.__apis.values()) {
      api.accessToken = accessToken
    }
  }

  get fetchTimeout() {
    return this.__apis.values().next().value.fetchTimeout
  }

  set fetchTimeout(fetchTimeout: number) {
    for (const api of this.__apis.values()) {
      api.fetchTimeout = fetchTimeout
    }
  }

  get files() {
    return this.__apis.get('files') as Files
  }

  set files(files: Files) {
    this.__setApi(files, 'files')
  }

  get permissions() {
    return this.__apis.get('permissions') as Permissions
  }

  set permissions(permissions: Permissions) {
    this.__setApi(permissions, 'permissions')
  }

  __setApi(api: GDriveApi, apiName: string) {
    this.__apis.set(apiName, api)

    api.accessToken = this.accessToken
  }
}
