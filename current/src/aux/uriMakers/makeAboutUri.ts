import type { ReadonlyDeep } from 'type-fest'
import type { IAboutParameters } from './types'

import { makeUri } from './makeUri'

export const makeAboutUri = ({
  queryParameters
}: ReadonlyDeep<IAboutParameters>): string => {
  return makeUri({ api: 'about', queryParameters })
}
