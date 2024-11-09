import type { IStandardParameters } from '../../api/types'
import type { TQueryParameterProcessor } from './types'

import { isArray } from 'radashi'

export const processStandardParameters: TQueryParameterProcessor<
  IStandardParameters
> = queryParameters => {
  if (isArray(queryParameters.fields)) {
    queryParameters.fields = queryParameters.fields.join()
  }
}
