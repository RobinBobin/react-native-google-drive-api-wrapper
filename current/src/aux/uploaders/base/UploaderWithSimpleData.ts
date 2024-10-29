import type { TJson } from 'src/types'
import type { TSimpleData } from '../types'

import { UploaderWithDataMimeType } from './UploaderWithDataMimeType'

export abstract class UploaderWithSimpleData extends UploaderWithDataMimeType<TJson> {
  protected data: TSimpleData = ''

  setData(data: TSimpleData): this {
    this.data = data

    return this
  }
}
