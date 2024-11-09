import type { IFileOutput } from '../../../api/files/types'
import type { Fetcher } from '../../Fetcher'

import { UploaderWithSimpleData } from '../base/UploaderWithSimpleData'
import { convertReadonlyDeepTSimpleDataToTBodyType } from './helpers/convertReadonlyDeepTSimpleDataToTBodyType'

export class SimpleUploader extends UploaderWithSimpleData {
  constructor(fetcher: Readonly<Fetcher>) {
    super(fetcher, 'media')
  }

  protected _execute(): Promise<IFileOutput> {
    return this.fetcher
      .setBody(
        convertReadonlyDeepTSimpleDataToTBodyType(this.data),
        this.dataMimeType
      )
      .fetchJson()
  }
}
