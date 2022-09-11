import { Uploader } from './Uploader'
import { MimeType } from '../../../MimeType'

export class MetadataOnlyUploader extends Uploader<any> {
  protected _execute(): Promise<any> {
    return this.fetcher.setBody(this.requestBody as string, MimeType.JSON).fetch()
  }
}
