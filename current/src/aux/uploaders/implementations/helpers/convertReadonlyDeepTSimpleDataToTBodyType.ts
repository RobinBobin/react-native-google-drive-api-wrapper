import type { TBodyType } from 'aux/Fetcher/types'
import type { ReadonlyDeep } from 'type-fest'
import type { TSimpleData } from '../../types'

import { isArray } from 'radashi'

// eslint-disable-next-line id-length
export const convertReadonlyDeepTSimpleDataToTBodyType = (
  simpleData: ReadonlyDeep<TSimpleData>
): TBodyType => {
  return isArray(simpleData) ?
      new Uint8Array(simpleData)
    : (simpleData as TBodyType)
}
