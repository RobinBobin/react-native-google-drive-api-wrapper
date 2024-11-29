import type { ReadonlyDeep } from 'type-fest'
import type { IAbout, TAboutGetQueryParameters } from './types'

import { fetchJson } from '../../aux/Fetcher'
import { AboutUriBuilder } from '../../aux/uriBuilders/about/AboutUriBuilder'
import { convertGetQueryParameters } from '../../aux/uriBuilders/about/convertGetQueryParameters'
import { GDriveApi } from '../GDriveApi'

export class About extends GDriveApi {
  get(
    queryParameters: ReadonlyDeep<TAboutGetQueryParameters>
  ): Promise<IAbout> {
    return fetchJson(
      this,
      new AboutUriBuilder().build({
        convert: convertGetQueryParameters,
        queryParameters
      })
    )
  }
}
