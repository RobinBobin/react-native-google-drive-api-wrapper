import type { IFileOutput } from '../../../api/files/types'

import { MIME_TYPE_JSON } from '../../../constants'
import { Uploader } from '../base/Uploader'

export class MetadataOnlyUploader extends Uploader<IFileOutput> {
  protected _execute(): Promise<IFileOutput> {
    return this.fetcher.setBody(this.requestBody, MIME_TYPE_JSON).fetchJson()
  }
}
