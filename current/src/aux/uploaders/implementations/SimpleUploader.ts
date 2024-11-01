import type { Fetcher } from 'aux/Fetcher'
import type { JsonObject } from 'type-fest'

import { UploaderWithSimpleData } from '../base/UploaderWithSimpleData'
import { convertReadonlyDeepTSimpleDataToTBodyType } from './convertReadonlyDeepTSimpleDataToTBodyType'

export class SimpleUploader extends UploaderWithSimpleData {
  constructor(fetcher: Readonly<Fetcher>) {
    super(fetcher, 'media')
  }

  protected _execute(): Promise<JsonObject> {
    return this.fetcher
      .setBody(
        convertReadonlyDeepTSimpleDataToTBodyType(this.data),
        this.dataMimeType
      )
      .fetchJson()
  }
}
