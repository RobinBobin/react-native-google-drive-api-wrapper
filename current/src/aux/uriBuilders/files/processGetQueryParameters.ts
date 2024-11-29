import type { IFilesGetQueryParameters } from '../../../api/files/types'
import type { IStandardParameters } from '../../../api/types'
import type { TWrappedQueryParameterProcessor } from '../types'

import { isBoolean } from 'radashi'

import { processCommonQueryParameters } from './processCommonQueryParameters'

type TQueryParameters = IFilesGetQueryParameters &
  Pick<IStandardParameters, 'alt'>

export const processGetQueryParameters: TWrappedQueryParameterProcessor<
  TQueryParameters,
  boolean | undefined
> = isContent => {
  return queryParameters => {
    processCommonQueryParameters(queryParameters)

    // alt.
    if (isBoolean(isContent)) {
      queryParameters.alt = isContent ? 'media' : 'json'
    }
  }
}
