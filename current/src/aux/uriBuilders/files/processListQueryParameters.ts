import type {
  IFilesListQueryParameters,
  TFilesListSpace
} from 'api/files/types'
import type { TProcessQueryParameters } from '../types'

import { ListQueryBuilder } from 'api/files/ListQueryBuilder'

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
  if (Array.isArray(queryParameters.spaces)) {
    queryParameters.spaces = queryParameters.spaces.join() as TFilesListSpace
  }
}
