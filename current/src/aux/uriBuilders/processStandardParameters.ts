import type { IStandardParameters } from 'api/types'
import type { TProcessQueryParameters } from './types'

export const processStandardParameters: TProcessQueryParameters<
  IStandardParameters
> = queryParameters => {
  if (Array.isArray(queryParameters.fields)) {
    queryParameters.fields = queryParameters.fields.join()
  }
}
