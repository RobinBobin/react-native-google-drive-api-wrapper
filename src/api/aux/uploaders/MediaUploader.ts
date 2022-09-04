import { Uploader } from './Uploader'
import { Fetcher } from '../Fetcher'
import { FetchResultType } from '../Fetcher/types'
import { FilesApi } from '../../files/FilesApi'

export class MediaUploader extends Uploader {
  constructor(fetcher: Fetcher<FilesApi>) {
    super(fetcher, 'media')
  }

  protected _execute(): FetchResultType {
    const body = Array.isArray(this.data) ? new Uint8Array(this.data) : this.data!

    return this.fetcher.setBody(body, this.dataType).fetch()
  }
}
