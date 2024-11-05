import type { IIncludeLabels } from 'api/files/types'
import type { IStandardParameters } from 'api/types'
import type { TProcessQueryParameters } from '../types'

import { isArray } from 'radashi'

type TQueryParameters = IStandardParameters & IIncludeLabels

export const processIncludeLabels: TProcessQueryParameters<
  TQueryParameters
> = queryParameters => {
  if (isArray(queryParameters.includeLabels)) {
    queryParameters.includeLabels = queryParameters.includeLabels.join()
  }
}
