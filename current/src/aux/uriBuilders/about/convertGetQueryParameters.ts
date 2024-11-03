import type { TAboutGetQueryParameters } from 'api/about/types'
import type { IStandardParameters } from 'api/types'
import type { TConvertQueryParameters } from '../types'

export const convertGetQueryParameters: TConvertQueryParameters<
  TAboutGetQueryParameters
> = queryParameters => {
  const isTFields =
    typeof queryParameters === 'string' || Array.isArray(queryParameters)

  return isTFields ?
      { fields: queryParameters }
    : ({ ...queryParameters } as IStandardParameters)
}
