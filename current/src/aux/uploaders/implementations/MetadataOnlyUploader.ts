import type { TJson } from 'src/types'

import { MIME_TYPE_JSON } from 'src/constants'

import { Uploader } from '../base/Uploader'

export class MetadataOnlyUploader extends Uploader<TJson> {
  protected _execute(): Promise<TJson> {
    return this.fetcher.setBody(this.requestBody, MIME_TYPE_JSON).fetchJson()
  }
}
