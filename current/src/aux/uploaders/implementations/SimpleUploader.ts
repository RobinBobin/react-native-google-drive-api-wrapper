import type { Fetcher } from 'aux/Fetcher'
import type { TJson } from 'src/types'

import { UploaderWithSimpleData } from '../base/UploaderWithSimpleData'
import { convertReadonlyDeepTSimpleDataToTBodyType } from './convertReadonlyDeepTSimpleDataToTBodyType'

export class SimpleUploader extends UploaderWithSimpleData {
  constructor(fetcher: Readonly<Fetcher>) {
    super(fetcher, 'media')
  }

  protected _execute(): Promise<TJson> {
    return this.fetcher
      .setBody(
        convertReadonlyDeepTSimpleDataToTBodyType(this.data),
        this.dataMimeType
      )
      .fetchJson()
  }
}
