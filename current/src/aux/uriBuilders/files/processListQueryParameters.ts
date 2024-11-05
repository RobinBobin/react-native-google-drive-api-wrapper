import type {
  IFilesListQueryParameters,
  TFilesListSpace
} from 'api/files/types'
import type { TProcessQueryParameters } from '../types'

import { ListQueryBuilder } from 'api/files/ListQueryBuilder'
import { isArray } from 'radashi'

import { processIncludeLabels } from './processIncludeLabels'

export const processListQueryParameters: TProcessQueryParameters<
  IFilesListQueryParameters
> = queryParameters => {
  processIncludeLabels(queryParameters)

  // orderBy

  // `q`.
  if (queryParameters.q instanceof ListQueryBuilder) {
    queryParameters.q = queryParameters.q.toString()
  }

  // spaces
  if (isArray(queryParameters.spaces)) {
    queryParameters.spaces = queryParameters.spaces.join() as TFilesListSpace
  }
}
