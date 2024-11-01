import type { Fetcher } from 'aux/Fetcher'
import type { TBodyType } from 'aux/Fetcher/types'
import type { JsonObject } from 'type-fest'

import { MIME_TYPE_JSON_UTF8 } from 'src/constants'
import { encode } from 'utf8'

import { UploaderWithSimpleData } from '../base/UploaderWithSimpleData'

export class MultipartUploader extends UploaderWithSimpleData {
  private isBase64 = false
  private multipartBoundary = 'foo_bar_baz'

  constructor(fetcher: Readonly<Fetcher>) {
    super(fetcher, 'multipart')
  }

  setIsBase64(isBase64: boolean): UploaderWithSimpleData {
    this.isBase64 = isBase64

    return this
  }

  setMultipartBoundary(multipartBoundary: string): UploaderWithSimpleData {
    this.multipartBoundary = multipartBoundary

    return this
  }

  protected _execute(): Promise<JsonObject> {
    const dashDashBoundary = `--${this.multipartBoundary}`
    const ending = `\n${dashDashBoundary}--`

    let body: TBodyType | string[] = [
      `\n${dashDashBoundary}\n`,
      `Content-Type: ${MIME_TYPE_JSON_UTF8}\n\n`,
      `${this.requestBody}\n\n${dashDashBoundary}\n`
    ]

    if (this.isBase64) {
      body.push('Content-Transfer-Encoding: base64\n')
    }

    body.push(`Content-Type: ${this.dataMimeType}\n\n`)

    body = body.join('')

    if (typeof this.data === 'string') {
      body += `${this.data}${ending}`
    } else {
      const convertStringToNumberArray = (string: string): number[] => {
        return encode(string)
          .split('')
          .map((char, index) => char.charCodeAt(index))
      }

      body = new Uint8Array(
        convertStringToNumberArray(body)
          .concat(Array.from(this.data))
          .concat(convertStringToNumberArray(ending))
      )
    }

    return this.fetcher
      .appendHeader('Content-Length', body.length.toString())
      .appendHeader(
        'Content-Type',
        `multipart/related; boundary=${this.multipartBoundary}`
      )
      .setBody(body)
      .fetchJson()
  }
}
