import type { IFilesCreateQueryParameters } from 'api/files/types'
import type { TUploadType } from 'uploaders/base/types'
import type { TProcessQueryParameters } from '../types'

import { processIncludeLabels } from './processIncludeLabels'

type TQueryParameters = IFilesCreateQueryParameters & {
  uploadType?: TUploadType
}

type TProcessCreateQueryParameters = (
  uploadType: TUploadType | undefined
) => TProcessQueryParameters<TQueryParameters>

export const processCreateQueryParameters: TProcessCreateQueryParameters =
  uploadType => {
    return queryParameters => {
      processIncludeLabels(queryParameters)

      // Process `uploadType`.
      if (uploadType) {
        queryParameters.uploadType = uploadType
      }
    }
  }
