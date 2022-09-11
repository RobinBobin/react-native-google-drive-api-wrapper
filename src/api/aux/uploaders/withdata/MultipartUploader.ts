import { ArrayStringifier, StaticUtils } from 'simple-common-utils'
import utf8 from 'utf8'
import { UploaderWithData } from './UploaderWithData'
import { Fetcher } from '../../Fetcher'
import { BodyType } from '../../Fetcher/types'
import { MimeType } from '../../../../MimeType'

export class MultipartUploader extends UploaderWithData {
  private isBase64 = false
  private multipartBoundary = 'foo_bar_baz'

  constructor(fetcher: Fetcher<any>) {
    super(fetcher, 'multipart')
  }

  setIsBase64(isBase64: boolean): UploaderWithData {
    this.isBase64 = isBase64

    return this
  }

  setMultipartBoundary(multipartBoundary: string): UploaderWithData {
    this.multipartBoundary = multipartBoundary

    return this
  }

  protected _execute(): Promise<any> {
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

    body.push(`Content-Type: ${this.dataMimeType}\n\n`)

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
