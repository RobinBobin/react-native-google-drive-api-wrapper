import { UploaderWithData } from './UploaderWithData'
import { Fetcher } from '../../Fetcher'

export class SimpleUploader extends UploaderWithData {
  constructor(fetcher: Fetcher<any>) {
    super(fetcher, 'media')
  }

  protected _execute(): Promise<any> {
    const body = Array.isArray(this.data) ? new Uint8Array(this.data) : this.data!

    return this.fetcher.setBody(body, this.dataMimeType).fetch()
  }
}
