import { MIME_TYPE_OCTET_STREAM } from '../../../constants'
import { Uploader } from './Uploader'

export abstract class UploaderWithDataMimeType<
  ExecuteResultType
> extends Uploader<ExecuteResultType> {
  protected dataMimeType: string = MIME_TYPE_OCTET_STREAM

  setDataMimeType(dataMimeType: string): this {
    this.dataMimeType = dataMimeType

    return this
  }
}
