import type { ReadonlyDeep } from 'type-fest'
import type { IAbout, TAboutGetQueryParameters } from './types'

import { GDriveApi } from 'api/GDriveApi'
import { fetchJson } from 'aux/Fetcher'
import { AboutUriBuilder } from 'aux/uriBuilders/about/AboutUriBuilder'
import { convertGetQueryParameters } from 'uriBuilders/about/convertGetQueryParameters'

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
