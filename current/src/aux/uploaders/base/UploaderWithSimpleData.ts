import type { ReadonlyDeep } from 'type-fest'
import type { IFileOutput } from '../../../api/files/types'
import type { TSimpleData } from '../types'

import { UploaderWithDataMimeType } from './UploaderWithDataMimeType'

export abstract class UploaderWithSimpleData extends UploaderWithDataMimeType<IFileOutput> {
  protected data: ReadonlyDeep<TSimpleData> = ''

  setData(data: ReadonlyDeep<TSimpleData>): this {
    this.data = data

    return this
  }
}
