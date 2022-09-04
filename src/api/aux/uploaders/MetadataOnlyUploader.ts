import { Uploader } from './Uploader'
import { FetchResultType } from '../Fetcher/types'
import { MimeTypes } from '../../../MimeTypes'

export class MetadataOnlyUploader extends Uploader {
  protected _execute(): FetchResultType {
    return this.fetcher.setBody(this.requestBody as string, MimeTypes.JSON).fetch()
  }
}
