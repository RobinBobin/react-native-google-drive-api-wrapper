import { Uploader } from './Uploader'
import { FetchResultType } from '../Fetcher/types'
import { MimeType } from '../../../MimeType'

export class MetadataOnlyUploader extends Uploader {
  protected _execute(): FetchResultType {
    return this.fetcher.setBody(this.requestBody as string, MimeType.JSON).fetch()
  }
}
