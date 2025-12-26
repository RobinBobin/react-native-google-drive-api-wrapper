import type { IFilesCommonQueryParameters } from '../../../api/files'
import type { TQueryParameterProcessor } from '../types'

import { isArray } from 'radashi'

export const processCommonQueryParameters: TQueryParameterProcessor<
  IFilesCommonQueryParameters
> = queryParameters => {
  if (isArray(queryParameters.includeLabels)) {
    queryParameters.includeLabels = queryParameters.includeLabels.join()
  }
}
