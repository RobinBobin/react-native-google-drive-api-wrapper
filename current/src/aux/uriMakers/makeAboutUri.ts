import type { IMakeAboutUriParameters } from './types'

import { makeUri } from './makeUri'

export const makeAboutUri = ({
  queryParameters
}: Readonly<IMakeAboutUriParameters>): string => {
  return makeUri({ api: 'about', queryParameters })
}
