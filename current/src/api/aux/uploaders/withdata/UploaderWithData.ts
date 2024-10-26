import type { TData } from './types'
import type { TUploadType } from '../types'
import { UploaderWithDataMimeType } from '../withdatamimetype/UploaderWithDataMimeType'
import { Fetcher } from '../../Fetcher'

export abstract class UploaderWithData extends UploaderWithDataMimeType<any> {
  protected data?: TData

  constructor(
    fetcher: Fetcher<any>,
    uploadType: TUploadType,
    isJsonResponseType: boolean = true
  ) {
    super(fetcher, uploadType, isJsonResponseType)
  }

  setData(data: TData): UploaderWithData {
    this.data = data

    return this
  }
}
