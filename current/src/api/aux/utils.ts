import { toByteArray } from 'base64-js'

export function blobToByteArray(blob: Blob): Promise<Uint8Array | null> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onerror = event => reject({ reader, event })

    reader.onload = () => {
      if (!reader.result) {
        reject(null)
        return
      }

      if (typeof reader.result === 'string') {
        const b64 = reader.result.split('data:application/octet-stream;base64,')[1]

        resolve(toByteArray(b64!))

        return
      }

      resolve(new Uint8Array(reader.result))
    }

    reader.readAsDataURL(blob)
  })
}

export function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && Boolean(value)
}
