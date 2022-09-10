import { ArrayStringifier, StaticUtils } from 'simple-common-utils'
import utf8 from 'utf8'
import { Uploader } from './Uploader'
import { Fetcher } from '../Fetcher'
import { BodyType, FetchResultType } from '../Fetcher/types'
import { MimeType } from '../../../MimeType'

export class MultipartUploader extends Uploader {
  private __multipartBoundary = 'foo_bar_baz'
  private isBase64 = false

  constructor(fetcher: Fetcher) {
    super(fetcher, 'multipart')
  }

  get multipartBoundary() {
    return this.__multipartBoundary
  }

  set multipartBoundary(multipartBoundary) {
    this.__multipartBoundary = multipartBoundary
  }

  setIsBase64(isBase64: boolean): Uploader {
    this.isBase64 = isBase64

    return this
  }

  protected _execute(): FetchResultType {
    const dashDashBoundary = `--${this.multipartBoundary}`
    const ending = `\n${dashDashBoundary}--`

    let body: BodyType | string[] = [
      `\n${dashDashBoundary}\n`,
      `Content-Type: ${MimeType.JSON_UTF8}\n\n`,
      `${this.requestBody}\n\n${dashDashBoundary}\n`,
    ]

    if (this.isBase64) {
      body.push('Content-Transfer-Encoding: base64\n')
    }

    body.push(`Content-Type: ${this.mimeType}\n\n`)

    body = new ArrayStringifier().setArray(body).setSeparator('').process()

    if (typeof this.data === 'string') {
      body += `${this.data}${ending}`
    } else {
      const converter = Array.isArray(this.data) ? (ar: number[]) => ar : Array.from

      const encodedBody = utf8.encode(body)
      const encodedEnding = utf8.encode(ending)

      const byteArray = StaticUtils.encodedUtf8ToByteArray(encodedBody)
        .concat(converter(this.data!))
        .concat(StaticUtils.encodedUtf8ToByteArray(encodedEnding))

      body = new Uint8Array(byteArray)
    }

    return this.fetcher
      .appendHeader('Content-Length', body.length.toString())
      .appendHeader(
        'Content-Type',
        `multipart/related; boundary=${this.multipartBoundary}`,
      )
      .setBody(body as BodyType)
      .fetch()
  }
}
