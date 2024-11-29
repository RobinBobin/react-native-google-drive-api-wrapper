import type { IFilesCreateQueryParameters } from '../../../api/files/types'
import type { TUploadType } from '../../uploaders/base/types'
import type { TWrappedQueryParameterProcessor } from '../types'

import { processCommonQueryParameters } from './processCommonQueryParameters'

type TQueryParameters = IFilesCreateQueryParameters & {
  uploadType?: TUploadType
}

export const processCreateQueryParameters: TWrappedQueryParameterProcessor<
  TQueryParameters,
  TUploadType | undefined
> = uploadType => {
  return queryParameters => {
    processCommonQueryParameters(queryParameters)

    // uploadType
    if (uploadType) {
      queryParameters.uploadType = uploadType
    }
  }
}
