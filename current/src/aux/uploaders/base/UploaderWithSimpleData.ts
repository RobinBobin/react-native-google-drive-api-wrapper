import type { JsonObject, ReadonlyDeep } from 'type-fest'
import type { TSimpleData } from '../types'

import { UploaderWithDataMimeType } from './UploaderWithDataMimeType'

export abstract class UploaderWithSimpleData extends UploaderWithDataMimeType<JsonObject> {
  protected data: ReadonlyDeep<TSimpleData> = ''

  setData(data: ReadonlyDeep<TSimpleData>): this {
    this.data = data

    return this
  }
}
