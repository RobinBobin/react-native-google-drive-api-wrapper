import type { TBodyType } from 'aux/Fetcher/types'
import type { ReadonlyDeep } from 'type-fest'
import type { TSimpleData } from '../types'

// eslint-disable-next-line id-length
export const convertReadonlyDeepTSimpleDataToTBodyType = (
  simpleData: ReadonlyDeep<TSimpleData>
): TBodyType => {
  return Array.isArray(simpleData) ?
      new Uint8Array(simpleData)
    : (simpleData as TBodyType)
}
