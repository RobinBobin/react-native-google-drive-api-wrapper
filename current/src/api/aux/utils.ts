import { toByteArray } from 'base64-js'
import { ArrayStringifier, StaticUtils } from 'simple-common-utils'

export function blobToByteArray(blob: Blob): Promise<Uint8Array | null> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onerror = event => reject({ reader, event })

    reader.onload = () => {
      if (!reader.result) {
        resolve(null)
        return
      }

      if (typeof reader.result === 'string') {
        const b64 = reader.result.split('data:application/octet-stream;base64,')[1]

        resolve(toByteArray(b64))

        return
      }

      resolve(new Uint8Array(reader.result))
    }

    reader.readAsDataURL(blob)
  })
}

export function stringifyQueryParameters(
  queryParameters: object,
  prefix: string = '?',
  separator: string = '&',
  quoteIfString: boolean = false,
) {
  const array = Object.entries(queryParameters).map(
    ([key, value]) => `${key}=${StaticUtils.safeQuoteIfString(value, quoteIfString)}`,
  )

  return new ArrayStringifier(array).setPrefix(prefix).setSeparator(separator).process()
}
