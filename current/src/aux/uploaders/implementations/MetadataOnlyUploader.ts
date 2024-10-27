import type { TJson } from 'src/types'
import { Uploader } from '../base/Uploader'
import { MimeType } from 'src/MimeType'

export class MetadataOnlyUploader extends Uploader<TJson> {
  protected _execute(): Promise<TJson> {
    return this.fetcher.setBody(this.requestBody, MimeType.JSON).fetchJson()
  }
}
