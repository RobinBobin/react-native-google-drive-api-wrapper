import type { JsonObject } from 'type-fest'

import { MIME_TYPE_JSON } from 'src/constants'

import { Uploader } from '../base/Uploader'

export class MetadataOnlyUploader extends Uploader<JsonObject> {
  protected _execute(): Promise<JsonObject> {
    return this.fetcher.setBody(this.requestBody, MIME_TYPE_JSON).fetchJson()
  }
}
