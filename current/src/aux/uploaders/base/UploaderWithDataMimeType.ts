import { MimeType } from 'src/MimeType'
import { Uploader } from './Uploader'

export abstract class UploaderWithDataMimeType<ExecuteResultType> extends Uploader<ExecuteResultType> {
  protected dataMimeType: string = MimeType.BINARY

  setDataMimeType(dataMimeType: string): UploaderWithDataMimeType<ExecuteResultType> {
    this.dataMimeType = dataMimeType

    return this
  }
}
