import { Data } from './types'
import { UploadType } from '../types'
import { UploaderWithDataMimeType } from '../withdatamimetype/UploaderWithDataMimeType'
import { Fetcher } from '../../Fetcher'

export abstract class UploaderWithData extends UploaderWithDataMimeType<any> {
  protected data?: Data

  constructor(
    fetcher: Fetcher<any>,
    uploadType: UploadType,
    isJsonResponseType: boolean = true
  ) {
    super(fetcher, uploadType, isJsonResponseType)
  }

  setData(data: Data): UploaderWithData {
    this.data = data

    return this
  }
}
