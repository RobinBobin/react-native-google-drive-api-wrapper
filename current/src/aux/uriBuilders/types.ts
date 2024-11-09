import type { ReadonlyDeep } from 'type-fest'
import type { IStandardParameters } from '../../api/types'

type TQueryParameterConverter<
  TRawQueryParameters,
  TQueryParameters extends IStandardParameters = IStandardParameters
> = (
  queryParameters: ReadonlyDeep<TRawQueryParameters>
) => ReadonlyDeep<TQueryParameters>

type TQueryParameterProcessor<TQueryParameters extends IStandardParameters> = (
  queryParameters: TQueryParameters
) => void

type TWrappedQueryParameterProcessor<
  TQueryParameters extends IStandardParameters,
  TWrappedProcessorParameters
> = (
  wrappedProcessorParameters: TWrappedProcessorParameters
) => TQueryParameterProcessor<TQueryParameters>

interface IBuildParameters<
  TRawQueryParameters,
  TQueryParameters extends IStandardParameters
> {
  convert?: TQueryParameterConverter<TRawQueryParameters, TQueryParameters>
  process?: TQueryParameterProcessor<TQueryParameters>
  queryParameters: ReadonlyDeep<TRawQueryParameters> | undefined
}

export type {
  IBuildParameters,
  TQueryParameterConverter,
  TQueryParameterProcessor,
  TWrappedQueryParameterProcessor
}
