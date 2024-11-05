import type { IStandardParameters } from 'api/types'
import type { ReadonlyDeep } from 'type-fest'

type TConvertQueryParameters<
  TRawQueryParameters,
  TQueryParameters extends IStandardParameters = IStandardParameters
> = (
  queryParameters: ReadonlyDeep<TRawQueryParameters>
) => ReadonlyDeep<TQueryParameters>

type TProcessQueryParameters<TQueryParameters extends IStandardParameters> = (
  queryParameters: TQueryParameters
) => void

interface IBuildParameters<
  TRawQueryParameters,
  TQueryParameters extends IStandardParameters
> {
  convert?: TConvertQueryParameters<TRawQueryParameters, TQueryParameters>
  process?: TProcessQueryParameters<TQueryParameters>
  queryParameters: ReadonlyDeep<TRawQueryParameters> | undefined
}

export type {
  IBuildParameters,
  TConvertQueryParameters,
  TProcessQueryParameters
}
