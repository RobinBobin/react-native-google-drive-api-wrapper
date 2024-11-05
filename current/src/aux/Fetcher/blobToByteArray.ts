import type { TBlobToByteArrayResultType } from './types'

import { toByteArray } from 'base64-js'
import { isString } from 'radashi'

import { BlobToByteArrayError } from './errors/BlobToByteArrayError'

export function blobToByteArray(
  blob: Readonly<Blob>
): Promise<TBlobToByteArrayResultType> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onerror = (event): void => {
      reject(new BlobToByteArrayError(event, 'reader.onerror', reader))
    }

    reader.onload = (event): void => {
      if (reader.result === null) {
        resolve(null)
        return
      }

      if (!isString(reader.result)) {
        resolve(new Uint8Array(reader.result))
        return
      }

      const b64 = reader.result.split(
        'data:application/octet-stream;base64,'
      )[1]

      if (isString(b64)) {
        resolve(toByteArray(b64))
      } else {
        reject(
          new BlobToByteArrayError(
            event,
            "'!b64', examine 'reader.result'",
            reader
          )
        )
      }
    }

    reader.readAsDataURL(blob)
  })
}
