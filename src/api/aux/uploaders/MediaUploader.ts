import Uploader from './Uploader'
import Fetcher, { FetchResultType } from '../Fetcher'
import FilesApi from '../../files/FilesApi'

export default class MediaUploader extends Uploader {
  constructor(fetcher: Fetcher<FilesApi>) {
    super(fetcher, 'media')
  }

  protected _execute(): FetchResultType {
    const body = Array.isArray(this.data) ? new Uint8Array(this.data) : this.data!

    return this.fetcher.setBody(body, this.dataType).fetch()
  }
}
