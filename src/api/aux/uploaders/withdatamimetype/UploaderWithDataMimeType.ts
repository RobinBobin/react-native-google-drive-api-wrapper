import { Uploader } from '../Uploader'
import { UploadType } from '../types'
import { Fetcher } from '../../Fetcher'

export abstract class UploaderWithDataMimeType<ExecuteResultType, FetcherResultType = ExecuteResultType> extends Uploader<ExecuteResultType, FetcherResultType> {
  protected dataMimeType = ''

  constructor(
    fetcher: Fetcher<FetcherResultType>,
    uploadType: UploadType,
    isJsonResponseType: boolean = true
  ) {
    super(fetcher, uploadType, isJsonResponseType)
  }

  setDataMimeType(dataMimeType: string): UploaderWithDataMimeType<ExecuteResultType, FetcherResultType> {
    this.dataMimeType = dataMimeType

    return this
  }
}
