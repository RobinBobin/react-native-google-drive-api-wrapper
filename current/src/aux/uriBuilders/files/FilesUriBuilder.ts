import { BaseUriBuilder } from '../BaseUriBuilder'

export class FilesUriBuilder extends BaseUriBuilder {
  constructor(method?: string) {
    super('files')

    this.setPath(method)
  }
}
