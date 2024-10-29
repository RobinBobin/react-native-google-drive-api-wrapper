import type { IAboutParameters } from './types'

import { makeUri } from './makeUri'

export const makeAboutUri = ({ queryParameters }: IAboutParameters): string => {
  return makeUri({ api: 'about', queryParameters })
}
