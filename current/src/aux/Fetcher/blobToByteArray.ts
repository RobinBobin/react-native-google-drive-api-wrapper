import type { TBlobToByteArrayResultType } from './types'

import { toByteArray } from 'base64-js'

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

      if (typeof reader.result !== 'string') {
        resolve(new Uint8Array(reader.result))
        return
      }

      const b64 = reader.result.split(
        'data:application/octet-stream;base64,'
      )[1]

      if (typeof b64 === 'string') {
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
