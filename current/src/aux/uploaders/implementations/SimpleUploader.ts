import type { TJson } from 'src/types'
import { Fetcher } from 'aux/Fetcher'
import { UploaderWithSimpleData } from '../base/UploaderWithSimpleData'

export class SimpleUploader extends UploaderWithSimpleData {
  constructor(fetcher: Fetcher) {
    super(fetcher, 'media')
  }

  protected _execute(): Promise<TJson> {
    const body =
      Array.isArray(this.data) ? new Uint8Array(this.data) : this.data

    return this.fetcher.setBody(body, this.dataMimeType).fetchJson()
  }
}
