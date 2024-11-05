import type { TAboutGetQueryParameters } from 'api/about/types'
import type { TConvertQueryParameters } from '../types'

import { isArray, isString } from 'radashi'

export const convertGetQueryParameters: TConvertQueryParameters<
  TAboutGetQueryParameters
> = queryParameters => {
  const isTFields = isString(queryParameters) || isArray(queryParameters)

  return isTFields ? { fields: queryParameters } : queryParameters
}
