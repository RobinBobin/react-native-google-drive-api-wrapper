import type {
  IFilesListQueryParameters,
  TFilesListSpace
} from 'api/files/types'
import type { TQueryParameterProcessor } from '../types'

import { ListQueryBuilder } from 'api/files/ListQueryBuilder'
import { isArray } from 'radashi'

import { processCommonQueryParameters } from './processCommonQueryParameters'

export const processListQueryParameters: TQueryParameterProcessor<
  IFilesListQueryParameters
> = queryParameters => {
  processCommonQueryParameters(queryParameters)

  // orderBy
  if (isArray(queryParameters.orderBy)) {
    const orderByElements = queryParameters.orderBy.map(
      ([property, sortOrder]) => {
        return sortOrder ? [property, sortOrder].join(' ') : property
      }
    )

    queryParameters.orderBy = orderByElements.join()
  }

  // q
  if (queryParameters.q instanceof ListQueryBuilder) {
    queryParameters.q = queryParameters.q.toString()
  }

  // spaces
  if (isArray(queryParameters.spaces)) {
    queryParameters.spaces = queryParameters.spaces.join() as TFilesListSpace
  }
}
