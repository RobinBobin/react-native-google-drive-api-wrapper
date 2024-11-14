import { mimeTypes } from '@robinbobin/mimetype-constants'

import { Uploader } from './Uploader'

export abstract class UploaderWithDataMimeType<
  ExecuteResultType
> extends Uploader<ExecuteResultType> {
  protected dataMimeType: string = mimeTypes.application.octetStream

  setDataMimeType(dataMimeType: string): this {
    this.dataMimeType = dataMimeType

    return this
  }
}
