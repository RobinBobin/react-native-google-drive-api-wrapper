import type { IStandardParameters } from 'api/types'
import type { TProcessQueryParameters } from './types'

import { isArray } from 'radashi'

export const processStandardParameters: TProcessQueryParameters<
  IStandardParameters
> = queryParameters => {
  if (isArray(queryParameters.fields)) {
    queryParameters.fields = queryParameters.fields.join()
  }
}
