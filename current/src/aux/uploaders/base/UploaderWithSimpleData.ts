import type { TJson } from 'src/types'
import type { ReadonlyDeep } from 'type-fest'
import type { TSimpleData } from '../types'

import { UploaderWithDataMimeType } from './UploaderWithDataMimeType'

export abstract class UploaderWithSimpleData extends UploaderWithDataMimeType<TJson> {
  protected data: ReadonlyDeep<TSimpleData> = ''

  setData(data: ReadonlyDeep<TSimpleData>): this {
    this.data = data

    return this
  }
}
