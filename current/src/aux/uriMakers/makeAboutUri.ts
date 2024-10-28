import { makeUri } from './makeUri'
import type { IAboutParameters } from './types'

export const makeAboutUri = ({ queryParameters }: IAboutParameters): string => {
  return makeUri({ api: 'about', queryParameters })
}
