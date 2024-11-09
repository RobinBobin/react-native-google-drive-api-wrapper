import type { ReadonlyDeep } from 'type-fest'
import type { IStandardParameters } from '../../api/types'
import type { IBuildParameters, TQueryParameterConverter } from './types'

import { chain, cloneDeep } from 'radashi'

import { processStandardParameters } from './processStandardParameters'

export class BaseUriBuilder {
  private fileId?: string | undefined
  private path?: string | undefined
  private preDrivePath?: string | undefined

  constructor(private readonly api: string) {
    // Nothing to do.
  }

  build<TRawQueryParameters, TQueryParameters extends IStandardParameters>(
    parameters?: Readonly<
      IBuildParameters<TRawQueryParameters, TQueryParameters>
    >
  ): string {
    const uri = [
      'https://www.googleapis.com',
      this.preDrivePath,
      'drive/v3',
      this.api,
      this.fileId,
      this.path
    ]
      .filter(Boolean)
      .join('/')

    const url = new URL(uri)

    const {
      convert,
      process,
      queryParameters: rawQueryParameters
    } = parameters ?? {}

    if (!process && typeof rawQueryParameters === 'undefined') {
      return url.toString()
    }

    const _convert: TQueryParameterConverter<
      unknown,
      TQueryParameters
    > = queryParameters => queryParameters as ReadonlyDeep<TQueryParameters>

    const _process = (queryParameters: TQueryParameters): TQueryParameters => {
      processStandardParameters(queryParameters)

      process?.(queryParameters)

      return queryParameters
    }

    const queryParameters = chain(
      convert ?? _convert,
      qq => cloneDeep(qq) as TQueryParameters,
      _process
    )(rawQueryParameters ?? ({} as ReadonlyDeep<TRawQueryParameters>))

    interface IValue {
      toString: () => string
    }

    for (const [key, value] of Object.entries(queryParameters)) {
      const typedValue = value as IValue

      url.searchParams.append(key, typedValue.toString())
    }

    return url.toString()
  }

  setFileId(fileId: string | undefined): this {
    this.fileId = fileId

    return this
  }

  setPath(path: string | undefined): this {
    this.path = path

    return this
  }

  setPreDrivePath(preDrivePath: string | undefined): this {
    this.preDrivePath = preDrivePath

    return this
  }
}
