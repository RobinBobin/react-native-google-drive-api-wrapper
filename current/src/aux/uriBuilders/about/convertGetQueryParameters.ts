import type { TAboutGetQueryParameters } from '../../../api/about/types'
import type { TQueryParameterConverter } from '../types'

import { isArray, isString } from 'radashi'

export const convertGetQueryParameters: TQueryParameterConverter<
  TAboutGetQueryParameters
> = queryParameters => {
  const isTFields = isString(queryParameters) || isArray(queryParameters)

  return isTFields ? { fields: queryParameters } : queryParameters
}
